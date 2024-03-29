import { server$ } from "@builder.io/qwik-city";
import {
  createContextId,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import timeout from "@async-generators/timeout";
import { once } from "events";
import _ from "lodash";
import mqtt from "mqtt";

import { getDeploymentTimestamp } from "./deployment";
import type { CalendarEvent, DataStore } from "./types";
import { StreamStatus } from "./types";

const DATA_STORE_TOPICS: Record<keyof DataStore, string> = {
  calendar_color: "mqtt-ical/david-at-color/events",
  date_time: "homeassistant_statestream/sensor/date_time_iso/state",
  weather_forecast_hourly:
    "homeassistant_statestream/weather/forecast_hourly/forecast",
  weather_condition: "homeassistant_statestream/weather/forecast_hourly/state",
  weather_temperature:
    "homeassistant_statestream/weather/forecast_hourly/temperature",
};

const TOPICS_TO_DATA_STORE: { [key: string]: keyof DataStore } = _.invert(
  DATA_STORE_TOPICS
) as { [key: string]: keyof DataStore };

// TODO: Can we enforce that the deserializer returns the right type?
const DATA_STORE_DESERIALIZERS: Record<keyof DataStore, (raw: string) => any> =
  {
    calendar_color: (val) =>
      _.sortBy(
        JSON.parse(val)
          .map((raw_event: any): CalendarEvent | null => {
            if (
              raw_event["UID"] &&
              raw_event["DTSTART"] &&
              raw_event["DTEND"] &&
              raw_event["SUMMARY"]
            ) {
              return {
                uid: raw_event["UID"][0]["value"],
                start_time: new Date(raw_event["DTSTART"][0]["value"]),
                end_time: new Date(raw_event["DTEND"][0]["value"]),
                summary: raw_event["SUMMARY"][0]["value"],
              };
            }
            return null;
          })
          .filter((event: CalendarEvent | null) => event != null),
        "start_time"
      ),
    date_time: (val) => val,
    weather_forecast_hourly: (val) =>
      JSON.parse(val).map((item: any) => ({
        temperature: item.temperature,
        condition: item.condition,
        date_time: new Date(item.datetime),
      })),
    weather_condition: (val) => val,
    weather_temperature: (val) => parseInt(val),
  };

interface MessageEvent {
  topic: string;
  content: Buffer;
}

const mqttStream = server$(async function* (withRetained: boolean) {
  const url = this.env.get("MQTT_URL");
  if (!url) {
    throw new Error("Missing env var MQTT_URL");
  }

  const username = this.env.get("MQTT_USER");
  const password = this.env.get("MQTT_PASS");
  const connection = await mqtt.connectAsync(url, {
    username,
    password,
  });

  const messageQueue: MessageEvent[] = [];
  connection.on("message", (topic, content) => {
    messageQueue.push({ topic, content });
  });

  try {
    await connection.subscribeAsync(Object.values(DATA_STORE_TOPICS), {
      qos: 0,
      // TODO: This doesn't seem to be doing anything, client is still getting repeats of retained messages
      rh: withRetained ? 1 : 0,
    });

    while (true) {
      while (messageQueue.length > 0) {
        const event = messageQueue.shift()!;
        const dataStoreKey = TOPICS_TO_DATA_STORE[event.topic];

        yield {
          key: dataStoreKey,
          content: DATA_STORE_DESERIALIZERS[dataStoreKey](
            event.content.toString()
          ),
        };
      }

      await once(connection, "message");
    }
  } catch (err) {
    if (_.isObject(err) && (err as any)["code"] === "ECONNRESET") {
      console.log("Client disconnect: connection reset");
    } else {
      console.log("######## Error in mqttStream");
      console.trace(err);
      console.log("########");
    }
  } finally {
    await connection.endAsync();
  }
});

interface UseStreamedDataStoreResult {
  data: DataStore;
  status: StreamStatus;
}

export const useStreamedDataStore = (): UseStreamedDataStoreResult => {
  const startupTimestamp = useSignal<number | null>(null);

  // TODO: Typing sin, we should be able to prove (or at least more explicitly
  // assert) that DataStore is fully populated after the useTask is done.
  const data = useStore<DataStore>({}, { deep: false });

  const status = useSignal<StreamStatus>(StreamStatus.INIT);

  // Server-side initialization
  useTask$(async () => {
    const unseenTopics = new Set(Object.keys(DATA_STORE_TOPICS));
    const mqtt = await mqttStream(true);
    startupTimestamp.value = await getDeploymentTimestamp();
    try {
      for await (const msg of timeout(mqtt, 250)) {
        data[msg.key] = msg.content;
        if (unseenTopics.has(msg.key)) {
          unseenTopics.delete(msg.key);
        }
        if (unseenTopics.size == 0) {
          return;
        }
      }
    } catch (e) {
      console.log("Error while initializing streamed data store", e);
      return;
    }
  });

  // Client-side updates
  useVisibleTask$(
    async () => {
      while (true) {
        try {
          const newTimestampValue = await getDeploymentTimestamp();
          if (
            startupTimestamp.value &&
            startupTimestamp.value != newTimestampValue
          ) {
            status.value = StreamStatus.REFRESHING;
            await new Promise((resolve) => _.delay(resolve, 10000));
            location.reload();
          }
          const mqtt = await mqttStream(false);
          status.value = StreamStatus.CONNECTED;
          for await (const msg of mqtt) {
            if (!_.isEqual(data[msg.key], msg.content)) {
              data[msg.key] = msg.content;
            }
          }
        } catch (err) {
          status.value = StreamStatus.DISCONNECTED;
          await new Promise((resolve) => _.delay(resolve, 5000));
        }
      }
    },
    { strategy: "document-ready" }
  );

  return { data, status: status.value };
};

export const StreamedDataStoreContext =
  createContextId<UseStreamedDataStoreResult>("streamed-data-store");

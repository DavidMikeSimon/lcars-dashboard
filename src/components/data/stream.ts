import { server$ } from "@builder.io/qwik-city";
import { once } from "events";
import _ from "lodash";

import mqtt from "mqtt";
import type { DataStore } from "./types";
import {
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { getDeploymentTimestamp } from "./deployment";

const DATA_STORE_TOPICS: Record<keyof DataStore, string> = {
  date_time: "sensor/date_time_iso/state",
  weather_forecast_hourly: "weather/forecast_hourly/forecast",
  weather_condition: "weather/forecast_hourly/state",
  weather_temperature: "weather/forecast_hourly/temperature",
};

const TOPICS_TO_DATA_STORE: { [key: string]: keyof DataStore } = _.invert(
  DATA_STORE_TOPICS
) as { [key: string]: keyof DataStore };

// TODO: Can we enforce that the deserializer returns the right type?
const DATA_STORE_DESERIALIZERS: Record<keyof DataStore, (raw: string) => any> =
  {
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
    const fullTopicNames = Object.values(DATA_STORE_TOPICS).map(
      (t) => `homeassistant_statestream/${t}`
    );
    await connection.subscribeAsync(fullTopicNames, {
      qos: 0,
      // TODO: This doesn't seem to be doing anything, client is still getting repeats of retained messages
      rh: withRetained ? 1 : 0,
    });

    while (true) {
      while (messageQueue.length > 0) {
        const event = messageQueue.shift()!;
        const shortTopic = event.topic.replace(
          "homeassistant_statestream/",
          ""
        );
        const dataStoreKey = TOPICS_TO_DATA_STORE[shortTopic];

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

export const useStreamedDataStore = (): DataStore => {
  const startupTimestamp = useSignal<number | null>(null);

  // TODO: Typing sin, we should be able to prove (or at least more explicitly
  // assert) that DataStore is fully populated after the useTask is done.
  const data = useStore<DataStore>({} as DataStore, { deep: false });

  // Server-side initialization
  // TODO: Some kind of timeout?
  useTask$(async () => {
    const unseenTopics = new Set(Object.keys(DATA_STORE_TOPICS));
    const mqtt = await mqttStream(true);
    startupTimestamp.value = await getDeploymentTimestamp();
    for await (const msg of mqtt) {
      data[msg.key] = msg.content;
      if (unseenTopics.has(msg.key)) {
        unseenTopics.delete(msg.key);
      }
      if (unseenTopics.size == 0) {
        return;
      }
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
            console.log("Going to refresh...");
            await new Promise((resolve) => _.delay(resolve, 3000));
            location.reload();
          }
          const mqtt = await mqttStream(false);
          for await (const msg of mqtt) {
            console.log("UPDATE", msg.key, msg.content);
            if (!_.isEqual(data[msg.key], msg.content)) {
              data[msg.key] = msg.content;
            }
          }
        } catch (err) {
          console.log("Disconnected from stream");
          console.log(err);
          await new Promise((resolve) => _.delay(resolve, 5000));
          console.log("Reconnecting...");
        }
      }
    },
    { strategy: "document-ready" }
  );

  return data;
};
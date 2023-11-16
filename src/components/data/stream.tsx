import { server$ } from "@builder.io/qwik-city";
import { once } from "events";
import { invert } from "lodash";

import mqtt from "mqtt";
import type { DataStore } from "./types";
import { useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik";

const DATA_STORE_TOPICS: Record<keyof DataStore, string> = {
  date_time: "sensor/date_time_iso/state",
  forecast_hourly_forecast: "weather/forecast_hourly/forecast",
  forecast_hourly_state: "weather/forecast_hourly/state",
  forecast_hourly_temperature: "weather/forecast_hourly/temperature",
};

const TOPICS_TO_DATA_STORE: { [key: string]: keyof DataStore } = invert(
  DATA_STORE_TOPICS
) as { [key: string]: keyof DataStore };

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

        yield {
          key: TOPICS_TO_DATA_STORE[shortTopic],
          content: event.content.toString(),
        };
      }

      // TODO: Do we need some sort of heartbeat message?
      await once(connection, "message");
    }
  } catch (err) {
    console.log("######## Error in mqttStream");
    console.trace(err);
    console.log("########");
  } finally {
    await connection.endAsync();
  }
});

export const useStreamedDataStore = (): DataStore => {
  // TODO: Typing sin, we should be able to prove (or at least more explicitly
  // assert) that DataStore is fully populated after the useTask is done.
  const data = useStore<DataStore>({} as DataStore, { deep: false });

  // Server-side initialization
  // TODO: Some kind of timeout?
  useTask$(async () => {
    const unseenTopics = new Set(Object.keys(DATA_STORE_TOPICS));
    const mqtt = await mqttStream(true);
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
  // TODO: What happens if this disconnects?
  useVisibleTask$(
    async () => {
      const mqtt = await mqttStream(false);
      for await (const msg of mqtt) {
        console.log("UPDATE", msg.key);
        data[msg.key] = msg.content;
      }
    },
    { strategy: "document-ready" }
  );

  return data;
};

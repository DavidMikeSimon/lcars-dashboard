import type { CSSProperties } from "@builder.io/qwik";
import {
  Slot,
  component$,
  useComputed$,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { server$, type DocumentHead } from "@builder.io/qwik-city";
import { once } from "events";
import { invert } from "lodash";

import mqtt from "mqtt";

// TODO Can we pull this from the CSS?
const COLORS = {
  gray: "#223344",

  pale_canary: "#FFFF99",
  golden_tanoi: "#FFCC66",
  neon_carrot: "#FF9933",
  eggplant: "#664466",
  lilac: "#cc99cc",
  anakiwa: "#99ccff",
  mariner: "#3366cc",
  bahama_blue: "#006699",
  red_alert: "#EE1100",

  blue_bell: "#9999cc",
  melrose: "#9999ff",
  hopbush: "#cc6699",
  chestnut_rose: "#cc6666",
  orange_peel: "#FF9966",
  atomic_tangerine: "#ff9900",

  danub: "#6688cc",
  indigo: "#4455bb",
  lavender_purple: "#9977aa",
  cosmic: "#774466",
  red_damask: "#dd6644",
  medium_carmine: "#AA5533",
  bourbon: "#bb6622",
  sandy_brown: "#ee9955",

  periwinkle: "#ccddff",
  dodger_blue: "#5599ff",
  dodger_blue_alt: "#3366ff",
  blue: "#0011ee",
  navy_blue: "#000088",
  husk: "#bbaa55",
  rust: "#bb4411",
  tamarillo: "#882211",
};

enum Corner {
  TopLeft = "TopLeft",
  TopRight = "TopRight",
  BottomLeft = "BottomLeft",
  BottomRight = "BottomRight",
}

interface InnerCornerProps {
  color: string;
  size: number;
  corner: Corner;
}

const InnerCorner = component$<InnerCornerProps>((props) => {
  const { color, size, corner } = props;

  const outerPositionStyle = {
    top: corner == Corner.TopLeft || corner == Corner.TopRight ? 0 : undefined,
    bottom:
      corner == Corner.BottomLeft || corner == Corner.BottomRight
        ? 0
        : undefined,
    left:
      corner == Corner.TopLeft || corner == Corner.BottomLeft ? 0 : undefined,
    right:
      corner == Corner.TopRight || corner == Corner.BottomRight ? 0 : undefined,
  };

  const cutoutPositionStyle = {
    top:
      corner == Corner.BottomLeft || corner == Corner.BottomRight
        ? `-${size}rem`
        : undefined,
    bottom:
      corner == Corner.TopLeft || corner == Corner.TopRight
        ? `-${size}rem`
        : undefined,
    left:
      corner == Corner.TopRight || corner == Corner.BottomRight
        ? `-${size}rem`
        : undefined,
    right:
      corner == Corner.TopLeft || corner == Corner.BottomLeft
        ? `-${size}rem`
        : undefined,
  };

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: color,
        width: `${size}rem`,
        height: `${size}rem`,
        overflow: "hidden",
        ...outerPositionStyle,
      }}
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: "black",
          borderRadius: `${size * 2}rem`,
          width: `${size * 2}rem`,
          height: `${size * 2}rem`,
          ...cutoutPositionStyle,
        }}
      />
    </div>
  );
});

enum Side {
  Left = "Left",
  Right = "Right",
}

interface LcarsBoxProps {
  color?: string;
  topEdge?: number;
  topCapped?: boolean;
  bottomEdge?: number;
  bottomCapped?: boolean;
  sideEdge?: number;
  side?: Side;
  innerCornerSize?: number;
  internalMargin?: number;
  style?: CSSProperties;
}

const LcarsBox = component$<LcarsBoxProps>((props) => {
  const {
    color = COLORS.golden_tanoi,
    topEdge,
    topCapped = false,
    sideEdge,
    side = Side.Left,
    bottomEdge,
    bottomCapped = false,
    innerCornerSize = 0.5,
    internalMargin = 0.5,
    style = {},
  } = props;

  const topEdgeComponentStyle: CSSProperties = topEdge
    ? {
        backgroundColor: color,
        height: `${topEdge}rem`,
        padding: `0 ${Math.max(
          innerCornerSize,
          sideEdge && topEdge <= sideEdge ? 0 : topEdge,
          topCapped ? topEdge / 2 : 0
        )}rem`,
        borderTopLeftRadius:
          side == Side.Right && topCapped ? `${topEdge / 2}rem` : undefined,
        borderTopRightRadius:
          side == Side.Left && topCapped ? `${topEdge / 2}rem` : undefined,
        borderBottomLeftRadius:
          side == Side.Right && topCapped ? `${topEdge / 2}rem` : undefined,
        borderBottomRightRadius:
          side == Side.Left && topCapped ? `${topEdge / 2}rem` : undefined,
      }
    : {};

  const bottomEdgeComponentStyle: CSSProperties = bottomEdge
    ? {
        backgroundColor: color,
        height: `${bottomEdge}rem`,
        padding: `0 ${Math.max(
          innerCornerSize,
          sideEdge && bottomEdge <= sideEdge ? 0 : bottomEdge,
          bottomCapped ? bottomEdge / 2 : 0
        )}rem`,
        borderTopLeftRadius:
          side == Side.Right && bottomCapped
            ? `${bottomEdge / 2}rem`
            : undefined,
        borderTopRightRadius:
          side == Side.Left && bottomCapped
            ? `${bottomEdge / 2}rem`
            : undefined,
        borderBottomLeftRadius:
          side == Side.Right && bottomCapped
            ? `${bottomEdge / 2}rem`
            : undefined,
        borderBottomRightRadius:
          side == Side.Left && bottomCapped
            ? `${bottomEdge / 2}rem`
            : undefined,
      }
    : {};

  return (
    <div style={{ ...style, display: "flex", flexDirection: "column" }}>
      {topEdge && (!sideEdge || topEdge > sideEdge) && (
        <div
          style={{
            ...topEdgeComponentStyle,
            borderTopLeftRadius:
              side == Side.Left
                ? `${topEdge}rem`
                : topEdgeComponentStyle.borderTopLeftRadius,
            borderTopRightRadius:
              side == Side.Right
                ? `${topEdge}rem`
                : topEdgeComponentStyle.borderTopRightRadius,
          }}
        >
          <Slot name="top" />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "row", flex: "1 1" }}>
        {sideEdge && (
          <div
            style={{
              backgroundColor: color,
              order: side == Side.Left ? 0 : 2,
              paddingTop: `${Math.max(
                innerCornerSize,
                topEdge && topEdge <= sideEdge ? topEdge + innerCornerSize : 0
              )}rem`,
              paddingBottom: `${Math.max(
                innerCornerSize,
                bottomEdge && bottomEdge <= sideEdge
                  ? bottomEdge + innerCornerSize
                  : 0
              )}rem`,
              width: `${sideEdge}rem`,
              [side == Side.Left
                ? "borderTopLeftRadius"
                : "borderTopRightRadius"]:
                topEdge && sideEdge >= topEdge
                  ? `${topEdge}rem`
                  : topCapped && !topEdge
                  ? `${sideEdge / 2}rem`
                  : undefined,
              [side == Side.Left
                ? "borderBottomLeftRadius"
                : "borderBottomRightRadius"]:
                bottomEdge && sideEdge >= bottomEdge
                  ? `${bottomEdge}rem`
                  : bottomCapped && !bottomEdge
                  ? `${sideEdge / 2}rem`
                  : undefined,
            }}
          >
            <Slot name="side" />
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1",
            order: 1,
          }}
        >
          {topEdge && sideEdge && sideEdge >= topEdge && (
            <div style={topEdgeComponentStyle}>
              <Slot name="top" />
            </div>
          )}
          <div style={{ position: "relative", flex: "1 1" }}>
            {topEdge && sideEdge && (
              <InnerCorner
                color={color}
                size={innerCornerSize}
                corner={side == Side.Left ? Corner.TopLeft : Corner.TopRight}
              />
            )}
            <div style={{ margin: `${internalMargin}rem` }}>
              <Slot name="content" />
            </div>
            {bottomEdge && sideEdge && (
              <InnerCorner
                color={color}
                size={innerCornerSize}
                corner={
                  side == Side.Left ? Corner.BottomLeft : Corner.BottomRight
                }
              />
            )}
          </div>
          {bottomEdge && sideEdge && sideEdge >= bottomEdge && (
            <div style={bottomEdgeComponentStyle}>
              <Slot name="bottom" />
            </div>
          )}
        </div>
      </div>
      {bottomEdge && (!sideEdge || bottomEdge > sideEdge) && (
        <div
          style={{
            ...bottomEdgeComponentStyle,
            borderBottomLeftRadius:
              side == Side.Left
                ? `${bottomEdge}rem`
                : bottomEdgeComponentStyle.borderBottomLeftRadius,
            borderBottomRightRadius:
              side == Side.Right
                ? `${bottomEdge}rem`
                : bottomEdgeComponentStyle.borderBottomRightRadius,
          }}
        >
          <Slot name="bottom" />
        </div>
      )}
    </div>
  );
});

interface ClockProps {
  dateTime?: string;
}

const ISO_PATTERN =
  /(?<year>\d+)-(?<month>\d+)-(?<day>\d+)T(?<hour>\d+):(?<minute>\d+):(?<second>\d+)/;

const Clock = component$<ClockProps>((props) => {
  const { dateTime } = props;

  const state = useComputed$(() => {
    const invisibleResult = {
      visible: false,
      numHour: 0,
      hour: "00",
      minute: "00",
    };

    if (!dateTime) {
      return invisibleResult;
    }

    const match = ISO_PATTERN.exec(dateTime);
    if (!match?.groups) {
      return invisibleResult;
    }

    const numHour = parseInt(match.groups.hour);
    const hour = (numHour % 12).toString().padStart(2, "0");
    const minute = match.groups.minute.padStart(2, "0");
    return { visible: true, numHour, hour, minute };
  });

  return (
    <div
      class="clock"
      style={{ visibility: state.value.visible ? "visible" : "hidden" }}
    >
      <span class="number">{state.value.hour.charAt(0)}</span>
      <span class="number">{state.value.hour.charAt(1)}</span>
      <span class="divider">:</span>
      <span class="number">{state.value.minute.charAt(0)}</span>
      <span class="number">{state.value.minute.charAt(1)}</span>
      <span class="am-pm">{state.value.numHour < 12 ? "AM" : "PM"}</span>
    </div>
  );
});

type DataStore = {
  date_time?: string;
};

const DATA_STORE_TOPICS: Record<keyof DataStore, string> = {
  date_time: "sensor/date_time_iso/state",
};

const TOPICS_TO_DATA_STORE: { [key: string]: keyof DataStore } = invert(
  DATA_STORE_TOPICS
) as { [key: string]: keyof DataStore };

export const mqttStream = server$(async function* () {
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

  try {
    for (const value of Object.values(DATA_STORE_TOPICS)) {
      await connection.subscribeAsync(`homeassistant_statestream/${value}`);
    }

    while (true) {
      const event = await once(connection, "message");
      const topic: string = event[0];
      const message: Buffer = event[1];
      const shortTopic = topic.replace("homeassistant_statestream/", "");

      yield {
        key: TOPICS_TO_DATA_STORE[shortTopic],
        message: message.toString(),
      };
    }
  } catch (err) {
    console.log("######## Error in mqttStream");
    console.trace(err);
    console.log("########");
  } finally {
    await connection.endAsync();
  }
});

export default component$(() => {
  const data = useStore<DataStore>({});

  useVisibleTask$(
    async () => {
      const mqtt = await mqttStream();
      for await (const msg of mqtt) {
        data[msg.key] = msg.message;
        console.log("SETTING DATA", data);
      }
    },
    { strategy: "document-ready" }
  );

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
      }}
    >
      <LcarsBox
        topEdge={2}
        sideEdge={3}
        bottomEdge={1}
        topCapped
        bottomCapped
        side={Side.Left}
        style={{ margin: "1rem", width: "100%" }}
      >
        <div
          q:slot="top"
          class="lcars-row-container"
          style={{ justifyContent: "flex-end" }}
        >
          <div style={{ backgroundColor: COLORS.chestnut_rose }}>AAAA</div>
          <div style={{ backgroundColor: COLORS.danub }}>BBBB</div>
          <div style={{ backgroundColor: COLORS.dodger_blue }}>CCCC</div>
          <div style={{ backgroundColor: "black" }}>sinclair</div>
        </div>
        <div q:slot="bottom" class="lcars-row-container">
          <div style={{ backgroundColor: COLORS.chestnut_rose }}>XXXX</div>
          <div style={{ backgroundColor: COLORS.danub }}>YYYY</div>
          <div style={{ backgroundColor: "black" }}>sinclair</div>
          <div style={{ backgroundColor: COLORS.dodger_blue }}>ZZZZ</div>
        </div>
        <div q:slot="side" class="lcars-col-container">
          <div style={{ backgroundColor: COLORS.chestnut_rose }}>LLLL</div>
          <div style={{ backgroundColor: COLORS.danub }}>MMMM</div>
          <div style={{ backgroundColor: COLORS.dodger_blue }}>RRRR</div>
        </div>
        <div
          q:slot="content"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <LcarsBox
            topEdge={1}
            sideEdge={2}
            side={Side.Right}
            topCapped
            bottomCapped
          >
            <div q:slot="content">{data.date_time}</div>
          </LcarsBox>
          <Clock dateTime={data.date_time} />
        </div>
      </LcarsBox>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sinclair",
};

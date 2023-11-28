import { component$ } from "@builder.io/qwik";

import { Clock } from "~/components/dashboard/clock";
import { useStreamedDataStore } from "~/components/data/stream";
import { LcarsBracket } from "~/components/lcars/bracket";
import { COLORS } from "~/components/lcars/colors";
import { Side } from "~/components/lcars/types";
import { Timeline } from "./timeline";
import { WeatherConditionIcon } from "./weather-condition-icon";
import { StreamStatus } from "../data/types";

const STREAM_STATUS_DESC_MAP: Record<StreamStatus, string> = {
  [StreamStatus.INIT]: "init",
  [StreamStatus.CONNECTED]: "conn",
  [StreamStatus.DISCONNECTED]: "discon",
  [StreamStatus.REFRESHING]: "refresh",
};

export const Dashboard = component$(() => {
  const { data, status } = useStreamedDataStore();

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
      }}
    >
      <LcarsBracket
        topEdge={2}
        sideEdge={7}
        bottomEdge={1}
        topCapped
        bottomCapped
        side={Side.Left}
        style={{ margin: "1rem", width: "100%" }}
        color={COLORS.lavender_purple}
      >
        <div
          q:slot="top"
          class="lcars-row-container"
          style={{ justifyContent: "flex-end" }}
        >
          {/* <div style={{ backgroundColor: COLORS.chestnut_rose }}>AAAA</div>
          <div style={{ backgroundColor: COLORS.danub }}>BBBB</div>
          <div style={{ backgroundColor: COLORS.dodger_blue }}>CCCC</div> */}
          <div style={{ backgroundColor: "black", fontSize: "2rem" }}>
            Sinclair
          </div>
        </div>
        <div q:slot="bottom" class="lcars-row-container">
          {/* <div style={{ backgroundColor: COLORS.chestnut_rose }}>XXXX</div>
          <div style={{ backgroundColor: COLORS.danub }}>YYYY</div> */}
          <div style={{ backgroundColor: "black" }}>
            STS: {STREAM_STATUS_DESC_MAP[status]}
          </div>
          {/* <div style={{ backgroundColor: COLORS.dodger_blue }}>ZZZZ</div> */}
        </div>
        <div q:slot="side" class="lcars-col-container">
          {/* <div style={{ backgroundColor: COLORS.chestnut_rose }}>LLLL</div>
          <div style={{ backgroundColor: COLORS.danub }}>MMMM</div>
          <div style={{ backgroundColor: COLORS.dodger_blue }}>RRRR</div> */}
        </div>
        <div q:slot="content" class="dashboard-main">
          <div class="dashboard-row">
            <Clock dateTime={data.date_time} />
            <div style={{ fontSize: "1.5rem" }}>
              Cond: <WeatherConditionIcon condition={data.weather_condition} />
              <br />
              Temp: {data.weather_temperature}&deg;
            </div>
          </div>
          <div>
            <Timeline
              dateTime={data.date_time}
              forecasts={data.weather_forecast_hourly}
              workCalendar={data.calendar_color}
            />
          </div>
        </div>
      </LcarsBracket>
    </div>
  );
});

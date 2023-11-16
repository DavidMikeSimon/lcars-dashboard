import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

import { Clock } from "~/components/dashboard/clock";
import { useStreamedDataStore } from "~/components/data/stream";
import { LcarsBracket } from "~/components/lcars/bracket";
import { COLORS } from "~/components/lcars/colors";
import { Side } from "~/components/lcars/types";

export default component$(() => {
  const data = useStreamedDataStore();

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
          <LcarsBracket
            topEdge={1}
            sideEdge={2}
            side={Side.Right}
            topCapped
            bottomCapped
          >
            <div
              q:slot="top"
              class="lcars-row-container"
              style={{ justifyContent: "flex-end" }}
            >
              <div style={{ backgroundColor: "black" }}>WEBSTER</div>
            </div>
            <div q:slot="content">
              cond: {data.forecast_hourly_state}
              <br />
              Temp: {data.forecast_hourly_temperature}
            </div>
          </LcarsBracket>
          <Clock dateTime={data.date_time} />
        </div>
      </LcarsBracket>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sinclair",
};

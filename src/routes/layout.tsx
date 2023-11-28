import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";

import { StreamStatus } from "~/components/data/types";
import { LcarsBracket } from "~/components/lcars/bracket";
import { COLORS } from "~/components/lcars/colors";
import { Side } from "~/components/lcars/types";

const STREAM_STATUS_DESC_MAP: Record<StreamStatus, string> = {
  [StreamStatus.INIT]: "init",
  [StreamStatus.CONNECTED]: "conn",
  [StreamStatus.DISCONNECTED]: "discon",
  [StreamStatus.REFRESHING]: "refresh",
};

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  //const { data, status } = useStreamedDataStore();
  const status = StreamStatus.CONNECTED; // FIXME: Need a shared connection context

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
          <div style={{ backgroundColor: "black", fontSize: "2rem" }}>
            Sinclair
          </div>
        </div>
        <div q:slot="bottom" class="lcars-row-container">
          <div style={{ backgroundColor: "black" }}>
            STS: {STREAM_STATUS_DESC_MAP[status]}
          </div>
        </div>
        <div q:slot="side" class="lcars-col-container">
          <div style={{ backgroundColor: COLORS.eggplant }}>STATUS</div>
          <div style={{ backgroundColor: COLORS.eggplant }}>NC</div>
        </div>
        <div q:slot="content" class="dashboard-main">
          <Slot />
        </div>
      </LcarsBracket>
    </div>
  );
});

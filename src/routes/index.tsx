import {
  CSSProperties,
  HTMLAttributes,
  Slot,
  component$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const COLORS = {
  gray: "#223344",
  white: "white",
  black: "black",

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

  const topEdgeComponentStyle = topEdge
    ? {
        backgroundColor: color,
        height: `${topEdge}rem`,
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

  const bottomEdgeComponentStyle = bottomEdge
    ? {
        backgroundColor: color,
        height: `${bottomEdge}rem`,
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
        />
      )}
      <div style={{ display: "flex", flexDirection: "row", flex: "1 1" }}>
        {sideEdge && side == Side.Left && (
          <div
            style={{
              backgroundColor: color,
              width: `${sideEdge}rem`,
              borderTopLeftRadius:
                topEdge && sideEdge >= topEdge
                  ? `${topEdge}rem`
                  : topCapped && !topEdge
                  ? `${sideEdge / 2}rem`
                  : undefined,
              borderBottomLeftRadius:
                bottomEdge && sideEdge >= bottomEdge
                  ? `${bottomEdge}rem`
                  : bottomCapped && !bottomEdge
                  ? `${sideEdge / 2}rem`
                  : undefined,
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: "1 1" }}>
          {topEdge && sideEdge && sideEdge >= topEdge && (
            <div style={topEdgeComponentStyle}></div>
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
              <Slot />
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
            <div style={bottomEdgeComponentStyle} />
          )}
        </div>
        {sideEdge && side == Side.Right && (
          <div
            style={{
              backgroundColor: color,
              width: `${sideEdge}rem`,
              borderTopRightRadius:
                topEdge && sideEdge >= topEdge
                  ? `${topEdge}rem`
                  : topCapped && !topEdge
                  ? `${sideEdge / 2}rem`
                  : undefined,
              borderBottomRightRadius:
                bottomEdge && sideEdge >= bottomEdge
                  ? `${bottomEdge}rem`
                  : bottomCapped && !bottomEdge
                  ? `${sideEdge / 2}rem`
                  : undefined,
            }}
          />
        )}
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
        ></div>
      )}
    </div>
  );
});

export default component$(() => {
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
        sideEdge={5}
        bottomEdge={1}
        topCapped
        bottomCapped
        style={{ margin: "1rem", width: "100%" }}
      >
        <div
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
            Foo foo foo
          </LcarsBox>
          <LcarsBox
            topEdge={1}
            sideEdge={2}
            side={Side.Right}
            topCapped
            bottomCapped
          >
            Bar bar bar
          </LcarsBox>
        </div>
      </LcarsBox>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sinclair",
};

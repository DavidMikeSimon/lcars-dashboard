import { Slot, component$ } from "@builder.io/qwik";
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
        ? `-${size}px`
        : undefined,
    bottom:
      corner == Corner.TopLeft || corner == Corner.TopRight
        ? `-${size}px`
        : undefined,
    left:
      corner == Corner.TopRight || corner == Corner.BottomRight
        ? `-${size}px`
        : undefined,
    right:
      corner == Corner.TopLeft || corner == Corner.BottomLeft
        ? `-${size}px`
        : undefined,
  };

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
        overflow: "hidden",
        ...outerPositionStyle,
      }}
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: "black",
          borderRadius: `${size * 2}px`,
          width: `${size * 2}px`,
          height: `${size * 2}px`,
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
  sideEdge?: number;
  side?: Side;
  bottomEdge?: number;
  bottomCapped?: boolean;
  innerCornerSize?: number;
}

const LcarsBox = component$<LcarsBoxProps>((props) => {
  const {
    color = COLORS.golden_tanoi,
    topEdge,
    topCapped,
    sideEdge,
    side = Side.Left,
    bottomEdge,
    bottomCapped,
    innerCornerSize = 16,
  } = props;

  const topEdgeComponentStyle = topEdge
    ? {
        backgroundColor: color,
        height: `${topEdge}px`,
        borderTopLeftRadius:
          side == Side.Right && topCapped ? `${topEdge / 2}px` : undefined,
        borderTopRightRadius:
          side == Side.Left && topCapped ? `${topEdge / 2}px` : undefined,
        borderBottomLeftRadius:
          side == Side.Right && topCapped ? `${topEdge / 2}px` : undefined,
        borderBottomRightRadius:
          side == Side.Left && topCapped ? `${topEdge / 2}px` : undefined,
      }
    : {};

  const bottomEdgeComponentStyle = bottomEdge
    ? {
        backgroundColor: color,
        height: `${bottomEdge}px`,
        borderTopLeftRadius:
          side == Side.Right && bottomCapped
            ? `${bottomEdge / 2}px`
            : undefined,
        borderTopRightRadius:
          side == Side.Left && bottomCapped ? `${bottomEdge / 2}px` : undefined,
        borderBottomLeftRadius:
          side == Side.Right && bottomCapped
            ? `${bottomEdge / 2}px`
            : undefined,
        borderBottomRightRadius:
          side == Side.Left && bottomCapped ? `${bottomEdge / 2}px` : undefined,
      }
    : {};

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {topEdge && (!sideEdge || topEdge > sideEdge) && (
        <div
          style={{
            ...topEdgeComponentStyle,
            borderTopLeftRadius:
              side == Side.Left
                ? `${topEdge}px`
                : topEdgeComponentStyle.borderTopLeftRadius,
            borderTopRightRadius:
              side == Side.Right
                ? `${topEdge}px`
                : topEdgeComponentStyle.borderTopRightRadius,
          }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "row" }}>
        {sideEdge && side == Side.Left && (
          <div
            style={{
              backgroundColor: color,
              width: `${sideEdge}px`,
              borderTopLeftRadius:
                topEdge && sideEdge >= topEdge ? `${topEdge}px` : undefined,
              borderBottomLeftRadius:
                bottomEdge && sideEdge >= bottomEdge
                  ? `${bottomEdge}px`
                  : undefined,
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: "1 1" }}>
          {topEdge && sideEdge && sideEdge >= topEdge && (
            <div style={topEdgeComponentStyle}></div>
          )}
          <div style={{ position: "relative" }}>
            {topEdge && sideEdge && (
              <InnerCorner
                color={color}
                size={innerCornerSize}
                corner={side == Side.Left ? Corner.TopLeft : Corner.TopRight}
              />
            )}
            <div style={{ margin: "20px" }}>
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
              width: `${sideEdge}px`,
              borderTopRightRadius:
                topEdge && sideEdge >= topEdge ? `${topEdge}px` : undefined,
              borderBottomRightRadius:
                bottomEdge && sideEdge >= bottomEdge
                  ? `${bottomEdge}px`
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
                ? `${bottomEdge}px`
                : bottomEdgeComponentStyle.borderBottomLeftRadius,
            borderBottomRightRadius:
              side == Side.Right
                ? `${bottomEdge}px`
                : bottomEdgeComponentStyle.borderBottomRightRadius,
          }}
        ></div>
      )}
    </div>
  );
});

export default component$(() => {
  return (
    <LcarsBox
      topEdge={40}
      sideEdge={200}
      bottomEdge={40}
      topCapped
      bottomCapped
    >
      Content content content.
    </LcarsBox>
  );
});

export const head: DocumentHead = {
  title: "Sinclair",
};

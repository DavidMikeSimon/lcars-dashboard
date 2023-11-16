import type { CSSProperties } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";
import { COLORS } from "./colors";
import { Corner, Side } from "./types";
import { InnerCorner } from "./inner-corner";

interface LcarsBracketProps {
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

export const LcarsBracket = component$<LcarsBracketProps>((props) => {
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

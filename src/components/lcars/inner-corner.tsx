import { component$ } from "@builder.io/qwik";
import { Corner } from "./types";

interface InnerCornerProps {
  color: string;
  size: number;
  corner: Corner;
}

export const InnerCorner = component$<InnerCornerProps>((props) => {
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

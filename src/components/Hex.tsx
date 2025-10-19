import * as React from "react";

export interface IHexProps {}

export function Hex(props: IHexProps) {
  const size = 18;
  const width = size * 2 + 3;
  const height = size * 2;

  const normal_points = [
    [width / 4, 0], // top-left
    [width - width / 4, 0], // top-right
    [width, height / 2], // right-middle
    [width - width / 4, height], // bottom-right
    [width / 4, height], // bottom-left
    [0, height / 2], // left-middle
  ]
    .map((p) => p.join(","))
    .join(" ");

  console.log(width, height);

  return (
    <svg width={width} height={height}>
      <polygon
        points={normal_points}
        fill="#6B7280"
        stroke="#374151"
        strokeWidth="2px"
      />
    </svg>
  );
}

import { useState } from "react";

export interface IHexProps {
  handleMove: (q: number, r: number) => void;
  q: number;
  r: number;
  fill: string;
}

export function Hex({ q, r, handleMove, fill }: IHexProps) {
  const size = 22;

  // todo: use proper calculated sizes
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

  return (
    <svg width={width} height={height} onClick={() => handleMove(q, r)}>
      <polygon
        points={normal_points}
        fill={fill}
        stroke="#374151"
        strokeWidth="2px"
        style={{ cursor: "pointer" }}
      />
    </svg>
  );
}

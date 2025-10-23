import { useState } from "react";
import { PLAYER_1_HOVER_COLOR, PLAYER_2_HOVER_COLOR } from "../const";
import type { Owner } from "../types";

export interface IHexProps {
  handleMove: (q: number, r: number) => void;
  q: number;
  r: number;
  fill: string;
  owner: Owner;
  currentPlayer: 1 | 2; // whose turn it is
  playerNumber: 1 | 2;
  local?: boolean;
  isLastMove: boolean;
}

export function Hex({
  q,
  r,
  handleMove,
  fill,
  owner,
  currentPlayer,
  playerNumber,
  local,
  isLastMove,
}: IHexProps) {
  const [isHovered, setIsHovered] = useState(false);
  const size = 22;

  const width = size * 2 + 3;
  const height = size * 2;

  const normal_points = [
    [width / 4, 0],
    [width - width / 4, 0],
    [width, height / 2],
    [width - width / 4, height],
    [width / 4, height],
    [0, height / 2],
  ]
    .map((p) => p.join(","))
    .join(" ");

  let displayFill = fill;
  if (owner === 0 && isHovered) {
    if (local) {
      displayFill =
        currentPlayer === 1 ? PLAYER_1_HOVER_COLOR : PLAYER_2_HOVER_COLOR;
    } else if (currentPlayer === playerNumber) {
      displayFill =
        playerNumber === 1 ? PLAYER_1_HOVER_COLOR : PLAYER_2_HOVER_COLOR;
    }
  }

  let stroke = "#1f1f1fff";

  if (isLastMove) stroke = "#bebebeff";

  return (
    <svg
      width={width}
      height={height}
      onClick={() => owner === 0 && handleMove(q, r)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: owner === 0 ? "pointer" : "default" }}
    >
      <defs>
        <radialGradient
          id={`grad-${q}-${r}`}
          cx="50%"
          cy="50%"
          r="50%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={displayFill} stopOpacity="1" />
          <stop offset="100%" stopColor={displayFill} stopOpacity="0.65" />
        </radialGradient>
      </defs>

      <polygon
        points={normal_points}
        fill={`url(#grad-${q}-${r})`}
        stroke={stroke}
        strokeWidth="2px"
      />
    </svg>
  );
}

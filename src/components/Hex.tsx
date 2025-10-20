import * as React from "react";

export interface IHexProps {
  currentPlayer: boolean;
  nextTurn: () => void;
  q: number;
  r: number;
}

export function Hex({ q, r, currentPlayer, nextTurn }: IHexProps) {
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

  const [tileColor, setTileColor] = React.useState("#6B7280");
  const [occupied, setOccupied] = React.useState(false);

  const handleMove = () => {
    if (occupied) return;

    if (currentPlayer) {
      setTileColor("#fbff00dd");
    } else {
      setTileColor("#9000ffd2");
    }

    setOccupied(true);
    nextTurn();
  };

  return (
    <svg width={width} height={height} onClick={handleMove}>
      <polygon
        points={normal_points}
        fill={tileColor}
        stroke="#374151"
        strokeWidth="2px"
      />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="black"
        fontSize="10"
        pointerEvents="none"
      >
        {`${q} ${r}`}
      </text>
    </svg>
  );
}

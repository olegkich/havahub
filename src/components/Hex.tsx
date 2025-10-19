import * as React from "react";

export interface IHexProps {
  currentPlayer: boolean;
  nextTurn: () => void;
  index: number;
}

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

  const [tileColor, setTileColor] = React.useState("#6B7280");
  const [occupied, setOccupied] = React.useState(false);

  const handleMove = () => {
    console.log(`clicked on: ${props.index}`);

    if (occupied) return;

    if (props.currentPlayer) {
      setTileColor("#e4e73db7");
    } else {
      setTileColor("#a953eab5");
    }

    setOccupied(true);
    props.nextTurn();
  };

  return (
    <svg width={width} height={height} onClick={handleMove}>
      <polygon
        points={normal_points}
        fill={tileColor}
        stroke="#374151"
        strokeWidth="2px"
      />
    </svg>
  );
}

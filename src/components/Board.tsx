import * as React from "react";
import { Hex } from "./Hex";

export interface IBoardProps {}

export function Board(props: IBoardProps) {
  const size = 8;
  const hexWidth = Math.sqrt(5) * 15;

  const rowCounts = [
    ...Array(size - 1)
      .fill(0)
      .map((_, i) => size + i),
    ...Array(size)
      .fill(0)
      .map((_, i) => size * 2 - 1 - i),
  ];

  const axialCoordinates: [number, number][] = [];

  for (let q = -size + 1; q < size; q++) {
    const count = rowCounts[q + size - 1];
    const rStart = -Math.floor(count / 2);
    for (let i = 0; i < count; i++) {
      const r = rStart + i;
      axialCoordinates.push([q, r]);
    }
  }

  const [currentPlayer, setCurrentPlayer] = React.useState<boolean>(true);

  const handleTurn = () => {
    setCurrentPlayer(!currentPlayer);
  };

  return (
    <div className="flex justify-center items-center pl-[50px] pr-[50px] bg-[#12182B] rounded-[12px]">
      {rowCounts.map((count, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-col items-center justify-center m-0 p-0"
        >
          {[...Array(count)].map((x, i) => {
            const q = rowIndex - (size - 1);

            const rMin = Math.max(-size + 1, -q - size + 1);

            const r = rMin + i;

            return (
              <div
                key={i}
                style={{
                  marginLeft: -(hexWidth * 0.3),
                }}
              >
                <Hex
                  q={q}
                  r={r}
                  currentPlayer={currentPlayer}
                  nextTurn={handleTurn}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

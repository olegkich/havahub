import * as React from "react";
import { Hex } from "./Hex";

export interface IBoardProps {}

export function Board(props: IBoardProps) {
  const size = 8;
  const rowCounts = [
    ...Array(size - 1)
      .fill(0)
      .map((_, i) => size + i),
    ...Array(size)
      .fill(0)
      .map((_, i) => size * 2 - 1 - i),
  ];

  console.log(rowCounts);

  const hexWidth = Math.sqrt(5) * 15;

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
          {[...Array(count)].map((_, i) => (
            <div
              key={i}
              // why???????
              style={{
                marginLeft: -(hexWidth * 0.29),
              }}
            >
              <Hex
                currentPlayer={currentPlayer}
                nextTurn={handleTurn}
                index={i}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

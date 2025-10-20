import { useRef, useState } from "react";
import { Hex } from "./Hex";
import { BoardLogic } from "../game/BoardLogic";
import { HEX_COLOR, PLAYER_1_COLOR, PLAYER_2_COLOR } from "../const";

export interface IBoardProps {}

export function Board(props: IBoardProps) {
  const logicalBoardRef = useRef(new BoardLogic());
  const logicalBoard = logicalBoardRef.current;

  const boardSize = 8;

  // todo: use proper calculated sizes
  const hexWidth = Math.sqrt(5) * 15;

  const rowCounts = [
    ...Array(boardSize - 1)
      .fill(0)
      .map((_, i) => boardSize + i),
    ...Array(boardSize)
      .fill(0)
      .map((_, i) => boardSize * 2 - 1 - i),
  ];

  const axialCoordinates: [number, number][] = [];

  for (let q = -boardSize + 1; q < boardSize; q++) {
    const count = rowCounts[q + boardSize - 1];
    const rStart = -Math.floor(count / 2);
    for (let i = 0; i < count; i++) {
      const r = rStart + i;
      axialCoordinates.push([q, r]);
    }
  }

  const [updateCounter, setUpdateCounter] = useState(0);

  const handleMove = (q: number, r: number) => {
    console.log("called", q, r);
    logicalBoard.move(q, r);
    setUpdateCounter(updateCounter + 1);
  };

  return (
    <div className="flex justify-center items-center pl-[50px] pr-[50px] bg-[#12182B] rounded-[12px]">
      {rowCounts.map((count, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-col items-center justify-center m-0 p-0"
        >
          {[...Array(count)].map((x, i) => {
            const q = rowIndex - (boardSize - 1);

            const rMin = Math.max(-boardSize + 1, -q - boardSize + 1);

            const r = rMin + i;

            logicalBoard.setInitialCoordinate(q, r);

            let fill = HEX_COLOR;

            if (logicalBoard.getHexOwner(q, r) == 1) fill = PLAYER_1_COLOR;
            if (logicalBoard.getHexOwner(q, r) == 2) fill = PLAYER_2_COLOR;

            return (
              <div
                key={i}
                // todo: fix whatever is causing this nonsense
                style={{
                  marginLeft: -(hexWidth * 0.3),
                }}
              >
                <Hex q={q} r={r} handleMove={handleMove} fill={fill} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

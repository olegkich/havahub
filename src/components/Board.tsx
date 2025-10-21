import { useRef, useState } from "react";
import { Hex } from "./Hex";
import { BoardLogic } from "../game/BoardLogic";
import {
  HEX_COLOR,
  PLAYER_1_COLOR,
  PLAYER_1_HOVER_COLOR,
  PLAYER_2_COLOR,
  PLAYER_2_HOVER_COLOR,
} from "../const";

export interface IBoardProps {
  boardSize: number;
}

export function Board(props: IBoardProps) {
  const boardSize = 8;

  const logicalBoardRef = useRef(new BoardLogic(boardSize));
  const logicalBoard = logicalBoardRef.current;

  const [winner, setWinner] = useState<number | null>(null);

  const edges: [number, number][] = [];

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
    if (winner != null) return;

    logicalBoard.move(q, r);

    if (logicalBoard.checkWin()) setWinner(logicalBoard.getPlayerToMove());

    logicalBoard.nextTurn();

    setUpdateCounter(updateCounter + 1);
  };

  return (
    <div className="flex justify-center items-center pl-[50px] pr-[50px] bg-[#12182B] rounded-[12px]">
      {winner != null && (
        <div
          // inline because tailwind doesn't support dynamic styles
          className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded"
          style={{
            backgroundColor: winner === 1 ? PLAYER_1_COLOR : PLAYER_2_COLOR,
          }}
        >
          Player {winner} wins!
        </div>
      )}

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

            const hexOwner = logicalBoard.getHexOwner(q, r);

            let fill = HEX_COLOR;

            if (hexOwner == 1) fill = PLAYER_1_COLOR;

            if (hexOwner == 2) fill = PLAYER_2_COLOR;

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

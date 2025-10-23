import { useEffect, useRef, useState } from "react";
import { Hex } from "./Hex";
import { BoardLogic } from "../game/BoardLogic";
import { HEX_COLOR, PLAYER_1_COLOR, PLAYER_2_COLOR } from "../const";
import { useNavigate } from "react-router-dom";
import { socket } from "../api/socket";
import type { MovePayload } from "../types";

export interface IBoardProps {
  boardSize: number;
  roomCode: string;
  playerNumber: 1 | 2;
  local?: boolean;
}

export function Board({
  boardSize,
  roomCode,
  playerNumber,
  local,
}: IBoardProps) {
  const navigate = useNavigate();

  const logicalBoardRef = useRef(new BoardLogic(boardSize));
  const logicalBoard = logicalBoardRef.current;

  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(playerNumber);

  useEffect(() => {
    logicalBoard.player = playerNumber;
  }, [playerNumber, logicalBoard]);

  const [winner, setWinner] = useState<number | null>(null);
  const [lastMove, setLastMove] = useState<number[]>([]);

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

  const [_, setUpdateCounter] = useState(0);

  useEffect(() => {
    if (local) return;
    // Listen for game-start event from server
    socket.on("game-start", (payload) => {
      console.log("Game started:", payload);
      // Optionally sync board size and first turn from payload
      logicalBoard.player = payload.currentTurn;
    });

    // Listen for move updates
    socket.on("move-made", (payload: MovePayload) => {
      const { q, r, player, nextTurn } = payload;

      logicalBoard.move(q, r);

      setLastMove([q, r]);

      if (logicalBoard.checkWin()) {
        setWinner(player);
        socket.emit("game-over", { roomCode, winner: player });
        return;
      }
      logicalBoard.nextTurn();
      setCurrentPlayer(nextTurn);
      setUpdateCounter((prev) => prev + 1);
    });

    // Listen for game-over
    socket.on("game-over", (payload) => {
      console.log("Game Over:", payload);
      setWinner(payload.winner);
    });

    const handlePlayerDisconnected = (payload: { message: string }) => {
      console.log(payload.message);
      alert("Opponent disconnected. Returning to menu...");
      navigate("/");
    };

    socket.on("player-disconnected", handlePlayerDisconnected);

    return () => {
      socket.off("game-start");
      socket.off("move-made");
      socket.off("game-over");
      socket.off("player-disconnected");
    };
  }, []);

  const handleMove = (q: number, r: number) => {
    if (winner != null) return;

    setLastMove([q, r]);

    if (local) {
      logicalBoard.move(q, r);

      if (logicalBoard.checkWin()) {
        setWinner(currentPlayer);
        return;
      }

      logicalBoard.nextTurn();
      setUpdateCounter((prev) => prev + 1);

      const next = logicalBoard.player;
      if (next === 1 || next === 2) {
        setCurrentPlayer(next);
      }

      return;
    }

    socket.emit("make-move", {
      roomCode,
      q,
      r,
    });
  };

  const handleResign = () => {
    if (local) return navigate("/");

    socket.emit("resign", { roomCode }); // notify server first
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="flex justify-center items-center pt-[30px] pb-[30px] pl-[50px] pr-[50px]  rounded-[12px]">
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

      <button
        className="cursor-pointer absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
        onClick={handleResign}
      >
        Quit / Resign
      </button>

      {rowCounts.map((count, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-col items-center justify-center m-0 p-0"
        >
          {[...Array(count)].map((_, i) => {
            const q = rowIndex - (boardSize - 1);

            const rMin = Math.max(-boardSize + 1, -q - boardSize + 1);

            const r = rMin + i;

            logicalBoard.setInitialCoordinate(q, r);

            const hexOwner = logicalBoard.getHexOwner(q, r)!;

            let fill = HEX_COLOR;

            if (hexOwner === playerNumber) fill = PLAYER_1_COLOR;
            if (hexOwner !== 0 && hexOwner !== playerNumber)
              fill = PLAYER_2_COLOR;

            return (
              <div
                key={i}
                // todo: fix whatever is causing this nonsense
                style={{
                  marginLeft: -(hexWidth * 0.3),
                }}
              >
                <Hex
                  q={q}
                  r={r}
                  handleMove={handleMove}
                  fill={fill}
                  owner={hexOwner} // owner of this hex
                  currentPlayer={currentPlayer} // whose turn it is
                  playerNumber={playerNumber}
                  local={local}
                  isLastMove={
                    lastMove[0] == q && lastMove[1] == r && lastMove.length > 0
                  }
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

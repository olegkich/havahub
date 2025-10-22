import * as React from "react";
import { Board } from "../components/Board";
import { useLocation } from "react-router-dom";

export interface IGameProps {}

export function Game(props: IGameProps) {
  const location = useLocation();
  const { boardSize, roomCode, playerNumber, local } = location.state as {
    boardSize: number;
    roomCode: string;
    playerNumber: 1 | 2;
    local?: boolean;
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <Board
        boardSize={boardSize}
        roomCode={roomCode}
        playerNumber={playerNumber}
        local={local}
      />
    </div>
  );
}

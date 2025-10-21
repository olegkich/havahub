import * as React from "react";
import { Board } from "../components/Board";
import { useLocation } from "react-router-dom";

export interface IGameProps {}

export function Game(props: IGameProps) {
  const location = useLocation();
  const boardSize = location.state?.boardSize ?? 8;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <Board boardSize={boardSize} />
    </div>
  );
}

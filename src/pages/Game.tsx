import * as React from "react";
import { Board } from "../components/Board";

export interface IGameProps {}

export function Game(props: IGameProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <Board />
    </div>
  );
}

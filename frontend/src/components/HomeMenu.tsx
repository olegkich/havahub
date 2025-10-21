import * as React from "react";
import { Button } from "./Button";
import { Navigate, useNavigate } from "react-router-dom";

export interface IHomeMenuProps {}

export function HomeMenu(props: IHomeMenuProps) {
  const navigate = useNavigate();

  const handlePlay = (boardSize: number) => {
    navigate("/game", { state: { boardSize } });
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-2">Create Game</h1>
      <p className="text-gray-400 mb-8">Select your preferred board size</p>

      <div className="grid grid-cols-2 gap-4">
        <Button
          className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-2xl py-3 px-6 text-lg"
          onClick={() => handlePlay(3)}
        >
          Tiny (3×3)
        </Button>

        <Button
          className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-2xl py-3 px-6 text-lg"
          onClick={() => handlePlay(5)}
        >
          Small (5×5)
        </Button>

        <Button
          className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-2xl py-3 px-6 text-lg"
          onClick={() => handlePlay(6)}
        >
          Medium (6×6)
        </Button>

        <Button
          className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-2xl py-3 px-6 text-lg"
          onClick={() => handlePlay(8)}
        >
          Large (8×8)
        </Button>
      </div>
    </div>
  );
}

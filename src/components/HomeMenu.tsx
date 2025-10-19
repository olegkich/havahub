import * as React from "react";
import { Button } from "./Button";
import { Navigate, useNavigate } from "react-router-dom";

export interface IHomeMenuProps {}

export function HomeMenu(props: IHomeMenuProps) {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-6 gap-6 bg-gray-900 text-white">
      <Button onClick={() => navigate("/game")}>Create Game</Button>

      <p className="text-gray-300 text-lg font-semibold">Available games:</p>

      <ul className="flex flex-col gap-2 w-64">
        {["Game 1", "Game 2", "Game 3"].map((game) => (
          <li
            key={game}
            className="
              px-4 py-2 rounded-lg bg-gray-800 text-gray-200
              hover:bg-slate-600 hover:text-white
              cursor-pointer 
            "
          >
            {game}
          </li>
        ))}
      </ul>
    </div>
  );
}

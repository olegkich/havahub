import * as React from "react";
import { Button } from "./Button";
import { Navigate, useNavigate } from "react-router-dom";

export interface IHomeMenuProps {}

export function HomeMenu(props: IHomeMenuProps) {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-6 gap-6 bg-gray-900 text-white">
      <Button onClick={() => navigate("/game")}>Play</Button>
    </div>
  );
}

import * as React from "react";
import { Hex } from "./Hex";

export interface IBoardProps {}

export function Board(props: IBoardProps) {
  return (
    <div>
      {[...Array(15)].map(() => {
        return <Hex />;
      })}
    </div>
  );
}

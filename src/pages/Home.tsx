import * as React from "react";
import { HomeMenu } from "../components/HomeMenu";

export interface IHomeProps {}

export function Home(props: IHomeProps) {
  return (
    <div className="flex items-center justify-center h-screen">
      <HomeMenu />
    </div>
  );
}

import { HomeMenu } from "../components/HomeMenu";

export interface IHomeProps {}

export function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <HomeMenu />
    </div>
  );
}

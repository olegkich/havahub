import * as React from "react";
import { Board } from "../components/Board";
import { useLocation } from "react-router-dom";
import { socket } from "../api/socket";

export function Game() {
  const location = useLocation();
  const { boardSize, roomCode, playerNumber, local, gameStarted } =
    location.state as {
      boardSize: number;
      roomCode: string;
      playerNumber: 1 | 2;
      local?: boolean;
      gameStarted?: boolean;
    };

  const [started, setStarted] = React.useState(
    local ? true : gameStarted ?? false
  );

  React.useEffect(() => {
    if (local) return;

    // wait for game-start if host
    if (!started) {
      socket.on("game-start", () => setStarted(true));
    }

    return () => {
      socket.off("game-start");
    };
  }, [local, started]);

  if (!started) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-2xl font-semibold mb-4">
          Waiting for another player to join...
        </h1>
        <p className="text-gray-400">Room code: {roomCode}</p>
        <p className="text-gray-400">You play as player {playerNumber}</p>
        <p className="text-gray-400">Board size: {boardSize}</p>
      </div>
    );
  }

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

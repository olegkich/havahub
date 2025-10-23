import { useState, useEffect } from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import { socket } from "../api/socket";
import { RoomList } from "./RoomsList";

export function HomeMenu() {
  const navigate = useNavigate();
  const [boardSize, setBoardSize] = useState(6);

  useEffect(() => {
    const onRoomCreated = (payload: {
      roomCode: string;
      boardSize: number;
      playerNumber: 1 | 2;
    }) => {
      navigate("/game", {
        state: {
          ...payload,
          gameStarted: false, // only creator — waiting for player 2
        },
      });
    };

    const onGameStart = (payload: {
      roomCode: string;
      boardSize: number;
      playerNumber: 1 | 2;
    }) => {
      navigate("/game", {
        state: {
          ...payload,
          gameStarted: true, // both players start
        },
      });
    };

    socket.on("room-created", onRoomCreated);
    socket.on("game-start", onGameStart);

    return () => {
      socket.off("room-created", onRoomCreated);
      socket.off("game-start", onGameStart);
    };
  }, [navigate]);

  const handlePlay = () => {
    socket.emit("create-room", { boardSize });
  };

  const handleJoinRoom = (roomCode: string) => {
    // Simply emit join-room, listener is already set up in useEffect
    socket.emit("join-room", { roomCode });
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="flex flex-row gap-12">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-2">Play Havannah</h1>
          <p className="text-gray-400 mb-8">Select your preferred board size</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[3, 4, 6, 8].map((size) => (
              <Button
                key={size}
                className={`bg-gray-800 hover:bg-gray-700 transition-colors rounded-2xl py-3 px-10 text-lg ${
                  boardSize === size ? "border-2 border-blue-800" : ""
                }`}
                onClick={() => setBoardSize(size)}
              >
                {size}×{size}
              </Button>
            ))}
          </div>

          <div>
            <Button
              className="bg-green-600 hover:bg-green-500 transition-colors rounded-2xl py-3 px-6 text-lg"
              onClick={handlePlay}
            >
              Create Room
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-500 transition-colors rounded-2xl py-3 px-6 text-lg"
              onClick={() =>
                navigate("/game", {
                  state: {
                    boardSize,
                    roomCode: null,
                    playerNumber: 1,
                    local: true,
                  },
                })
              }
            >
              Play Locally
            </Button>
          </div>
        </div>

        {/* Available Rooms */}
        <div className="flex flex-col">
          <RoomList onJoin={handleJoinRoom} />
        </div>
      </div>
    </div>
  );
}

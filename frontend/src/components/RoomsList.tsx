import { useEffect, useState } from "react";
import { socket } from "../api/socket";

interface Room {
  roomCode: string;
  boardSize: number;
}

interface IRoomListProps {
  onJoin: (roomCode: string) => void;
}

export function RoomList({ onJoin }: IRoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);

  // Request rooms when component mounts
  useEffect(() => {
    socket.emit("get-rooms");

    socket.on("rooms-list", (rooms: Room[]) => {
      setRooms(rooms);
    });

    return () => {
      socket.off("rooms-list");
    };
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Available Rooms</h2>
      {rooms.length === 0 && <p>No available rooms</p>}
      <ul>
        {rooms.map((room) => (
          <li
            key={room.roomCode}
            className="flex justify-between items-center bg-gray-800 p-2 mb-2 rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => onJoin(room.roomCode)}
          >
            <span>
              Room {room.roomCode} Size: {room.boardSize}×{room.boardSize}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

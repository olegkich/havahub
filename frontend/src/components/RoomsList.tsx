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

  const fetchRooms = () => {
    socket.emit("get-rooms");
  };

  useEffect(() => {
    fetchRooms();

    const handleRoomsList = (rooms: Room[]) => {
      setRooms(rooms);
    };

    socket.on("rooms-list", handleRoomsList);

    return () => {
      socket.off("rooms-list", handleRoomsList);
    };
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Available Rooms</h2>

      {rooms.length === 0 && (
        <small className="text-grey">No available rooms</small>
      )}
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

      <button
        className="mb-4 mt-10 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
        onClick={fetchRooms}
      >
        Reload Rooms
      </button>
    </div>
  );
}

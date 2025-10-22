import { GameRoom } from "../types";
import { generateRoomCode } from "./generateRoomCode";

export const createRoom = (boardSize: number, socketId: string): GameRoom => {
  return {
    roomCode: generateRoomCode(),
    boardSize: boardSize,
    // !TODO --- Allow players to choose who plays first
    players: [{ socketId: socketId, playerNumber: 1 }],
    moves: [],
    currentTurn: 1,
    gameStarted: false,
    createdAt: new Date(),
  };
};

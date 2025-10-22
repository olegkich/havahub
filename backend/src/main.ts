import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import {
  CreateRoomPayload,
  GameMove,
  GameOverPayload,
  GameRoom,
  GameStartPayload,
  JoinRoomPayload,
  MakeMovePayload,
  MoveMadePayload,
  Player,
  PlayerDisconnectedPayload,
  RoomCreatedPayload,
} from "./types";
import { generateRoomCode } from "./util/generateRoomCode";
import { createRoom } from "./util/createRoom";

// --- SETUP ---
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const GameRooms: Map<string, GameRoom> = new Map();

// -- SOCKET EVENTS ---
io.on("connection", (socket) => {
  socket.on("create-room", (payload: CreateRoomPayload) => {});

  socket.on("join-room", (payload: JoinRoomPayload) => {
    const { roomCode } = payload;

    const room = GameRooms.get(roomCode);

    if (!room) throw new Error(`No room found with room code: ${roomCode}`);

    // !TODO --- Add proper server replies and exeption handling
    if (room.players.length > 2) return console.log("room is full");

    if (!room.players[0]) return console.log("No first player?");

    if (room.gameStarted)
      return console.log("Too late buddy they are playing without you");

    // !TODO --- Allow players to choose who plays first
    const player2: Player = { socketId: socket.id, playerNumber: 2 };

    room.players.push(player2);

    room.gameStarted = true;

    GameRooms.set(room.roomCode, room);

    const startPayload: GameStartPayload = {
      players: room.players,
      boardSize: room.boardSize,
      currentTurn: room.currentTurn,
    };
    room.players.forEach((player) =>
      io.to(player.socketId).emit("game-start", startPayload)
    );
  });

  socket.on("make-move", (payload: MakeMovePayload) => {
    const { roomCode, q, r } = payload;

    const room = GameRooms.get(roomCode);

    if (!room) throw new Error(`No room found with room code: ${roomCode}`);

    const player = room.players.find((p) => p.socketId === socket.id);

    if (!player) throw new Error("Who are you?");

    if (room.currentTurn != player.playerNumber)
      return console.log("not players turn");

    const move: GameMove = {
      q,
      r,
      player: player.playerNumber,
      timestamp: new Date(),
    };

    // !TODO
    if (move) console.log("implement move validation");

    room.moves.push(move);

    room.currentTurn = room.currentTurn === 1 ? 2 : 1;

    GameRooms.set(room.roomCode, room);

    const movePayload: MoveMadePayload = {
      q,
      r,
      player: player.playerNumber,
      nextTurn: room.currentTurn,
    };

    room.players.forEach((p) =>
      io.to(p.socketId).emit("move-made", movePayload)
    );
  });

  socket.on("game-over", (payload: GameOverPayload) => {
    const { roomCode, winner } = payload;

    const room = GameRooms.get(roomCode);

    if (!room) throw new Error(`No room found with room code: ${roomCode}`);

    // !TODO --- Room cleanup?

    const gameOverPayload: GameOverPayload = { roomCode, winner };

    room.players.forEach((p) =>
      io.to(p.socketId).emit("game-over", gameOverPayload)
    );
  });

  socket.on("disconnect", () => {
    for (const [roomCode, room] of GameRooms.entries()) {
      const playerIndex = room.players.findIndex(
        (p) => p.socketId === socket.id
      );

      if (playerIndex !== -1) {
        const player = room.players[playerIndex];

        console.log(
          `player ${player.playerNumber} disconnected from room ${roomCode}`
        );

        room.players.splice(playerIndex, 1);

        room.players.forEach((p) => {
          io.to(p.socketId).emit("player-disconnected", {
            message: `player ${player.playerNumber} disconnected`,
          } as PlayerDisconnectedPayload);
        });

        if (room.players.length === 0) {
          GameRooms.delete(roomCode);
        } else {
          GameRooms.set(roomCode, room);
        }

        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

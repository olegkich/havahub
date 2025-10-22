export interface CreateRoomPayload {
  boardSize: number;
}

export interface JoinRoomPayload {
  roomCode: string;
}

export interface MakeMovePayload {
  roomCode: string;
  q: number;
  r: number;
}

export interface GameOverPayload {
  roomCode: string;
  winner: 1 | 2;
}

export interface RoomCreatedPayload {
  roomCode: string;
  playerNumber: 1 | 2;
  boardSize: number;
}

export interface RoomJoinedPayload {
  roomCode: string;
  playerNumber: 1 | 2;
  boardSize: number;
}

export interface GameStartPayload {
  players: Player[];
  boardSize: number;
  currentTurn: 1 | 2;
}

export interface MoveMadePayload {
  q: number;
  r: number;
  player: 1 | 2;
  nextTurn: 1 | 2;
}

export interface GameEndedPayload {
  winner: 1 | 2;
}

export interface PlayerDisconnectedPayload {
  message: string;
}

export interface ErrorPayload {
  message: string;
}

export interface Player {
  // id: string;
  playerNumber: 1 | 2;
  socketId: string;
}

export interface GameMove {
  q: number;
  r: number;
  player: 1 | 2;
  timestamp: Date;
}

export interface GameRoom {
  roomCode: string;
  players: Player[];
  boardSize: number;
  currentTurn: 1 | 2;
  gameStarted: boolean;
  moves: GameMove[];
  createdAt: Date;
}

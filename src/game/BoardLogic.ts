import type { BoardState, Owner, PlayerToMove } from "../types";

export class BoardLogic {
  boardState: BoardState;

  // fix this type mumbo jumbo
  player: 0 | 1 | 2;

  constructor() {
    this.boardState = new Map();
    this.player = 1;
  }

  move(q: number, r: number) {
    this.boardState.set(`${q},${r}`, { q, r, owner: this.player });
    this.nextTurn();
  }

  setInitialCoordinate(q: number, r: number) {
    this.boardState.set("q,r", { q, r, owner: 0 });
  }

  private nextTurn() {
    this.player = this.player == 1 ? 2 : 1;
  }

  getHexOwner(q: number, r: number) {
    return this.boardState.get(`${q},${r}`)?.owner;
  }

  getPlayerToMove() {
    return this.player;
  }
}

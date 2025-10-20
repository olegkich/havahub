// 0 - free, player 1, player 2
export type Owner = 0 | 1 | 2;

export type PlayerToMove = 1 | 2;

export interface HexState {
  q: Number;
  r: Number;
  owner: Owner;
}

export type BoardState = Map<string, HexState>;

// 0 - free, player 1, player 2
export type Owner = 0 | 1 | 2;

export type PlayerToMove = 1 | 2;

export interface HexState {
  q: number;
  r: number;
  owner: Owner;
}

export type BoardState = Map<string, HexState>;

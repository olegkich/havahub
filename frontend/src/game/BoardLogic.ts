import type { BoardState, Owner, PlayerToMove } from "../types";

// (q, r) -> Hex

export class BoardLogic {
  boardState: BoardState;

  // fix this type mumbo jumbo
  player: Owner;

  edges: [number, number][][];
  corners: [number, number][];

  boardSize: number;

  constructor(boardSize: number) {
    this.boardSize = boardSize;
    this.boardState = new Map();
    this.player = 1;
    this.edges = this.calculateEdges();
    this.corners = this.calculateCorners();
  }

  move(q: number, r: number) {
    const tile = `${q},${r}`;

    if (this.boardState.get(tile)!.owner != 0) return;

    this.boardState.set(tile, { q, r, owner: this.player });
  }

  setInitialCoordinate(q: number, r: number) {
    if (this.boardState.get(`${q},${r}`)) return;
    this.boardState.set(`${q},${r}`, { q, r, owner: 0 });
  }

  nextTurn() {
    this.player = this.player == 1 ? 2 : 1;
  }

  getHexOwner(q: number, r: number) {
    return this.boardState.get(`${q},${r}`)?.owner;
  }

  getPlayerToMove() {
    return this.player;
  }

  getOpponent() {
    return this.player == 1 ? 2 : 1;
  }

  private calculateCorners(): [number, number][] {
    return [
      [-this.boardSize + 1, 0], // top-left
      [-this.boardSize + 1, this.boardSize - 1], // top-right
      [0, this.boardSize - 1], // right-top
      [this.boardSize - 1, 0], // bottom-right
      [this.boardSize - 1, -this.boardSize + 1], // bottom-left
      [0, -this.boardSize + 1], // left-bottom
    ];
  }

  private calculateEdges(): [number, number][][] {
    const edges: [number, number][][] = [];
    const N = this.boardSize;

    // Top-left to top-right (along top)
    const edge0: [number, number][] = [];
    for (let q = -N + 2; q <= -1; q++) {
      edge0.push([q, N - 1]);
    }
    edges.push(edge0);

    // Top-right to right (along upper-right)
    const edge1: [number, number][] = [];
    for (let q = 1; q <= N - 2; q++) {
      edge1.push([q, N - 1 - q]);
    }
    edges.push(edge1);

    // Right to bottom-right (along lower-right)
    const edge2: [number, number][] = [];
    for (let r = -1; r >= -N + 2; r--) {
      edge2.push([N - 1, r]);
    }
    edges.push(edge2);

    // Bottom-right to bottom-left (along bottom)
    const edge3: [number, number][] = [];
    for (let q = N - 2; q >= 1; q--) {
      edge3.push([q, -N + 1]);
    }
    edges.push(edge3);

    // Bottom-left to left (along lower-left)
    const edge4: [number, number][] = [];
    for (let q = -1; q >= -N + 2; q--) {
      edge4.push([q, -N + 1 - q]);
    }
    edges.push(edge4);

    // Left to top-left (along upper-left)
    const edge5: [number, number][] = [];
    for (let r = 1; r <= N - 2; r++) {
      edge5.push([-N + 1, r]);
    }
    edges.push(edge5);

    return edges;
  }

  // ------------- WIN CONDITIONS ----------------

  private getNeighbors(q: number, r: number): [number, number][] {
    return [
      [q + 1, r],
      [q - 1, r],
      [q, r + 1],
      [q, r - 1],
      [q + 1, r - 1],
      [q - 1, r + 1],
    ];
  }

  checkBridge(player: number): boolean {
    const seen = new Set<string>();
    for (const [key, tile] of this.boardState) {
      if (tile.owner !== player) continue;
      if (seen.has(key)) continue;

      const { corners, componentTiles } = this.findConnectedBoundaries(
        tile.q,
        tile.r,
        player
      );
      for (const t of componentTiles) seen.add(t);

      console.log("connected corners: ", corners.size);

      if (corners.size >= 2) return true;
    }
    return false;
  }

  private findConnectedBoundaries(
    startQ: number,
    startR: number,
    player: Owner
  ): { corners: Set<number>; edges: Set<number>; componentTiles: Set<string> } {
    const visited = new Set<string>();
    const queue: [number, number][] = [[startQ, startR]];
    const cornersFound = new Set<number>();
    const edgesFound = new Set<number>();

    visited.add(`${startQ},${startR}`);

    while (queue.length > 0) {
      const [q, r] = queue.shift()!;

      // Check if this tile is a corner
      const cornerIndex = this.isCorner(q, r);
      if (cornerIndex !== null) {
        cornersFound.add(cornerIndex);
      }

      // Check if this tile is on an edge
      const edgeIndex = this.isOnEdge(q, r);
      if (edgeIndex !== null) {
        edgesFound.add(edgeIndex);
      }

      // Check all neighbors
      const neighbors = this.getNeighbors(q, r);
      for (const [nq, nr] of neighbors) {
        const key = `${nq},${nr}`;
        if (visited.has(key)) continue;

        if (this.getHexOwner(nq, nr) === player) {
          visited.add(key);
          queue.push([nq, nr]);
        }
      }
    }

    return {
      corners: cornersFound,
      edges: edgesFound,
      componentTiles: visited,
    };
  }

  private isCorner(q: number, r: number): number | null {
    for (let i = 0; i < this.corners.length; i++) {
      if (this.corners[i][0] === q && this.corners[i][1] === r) {
        return i;
      }
    }
    return null;
  }

  checkFork(player: number): boolean {
    const seen = new Set<string>();
    for (const [key, tile] of this.boardState) {
      if (tile.owner !== player) continue;
      if (seen.has(key)) continue;

      const { edges, componentTiles } = this.findConnectedBoundaries(
        tile.q,
        tile.r,
        player
      );
      for (const t of componentTiles) seen.add(t);

      console.log(`Player ${player} connects to edges:`, edges);
      if (edges.size >= 3) return true;
    }
    return false;
  }

  private isOnEdge(q: number, r: number): number | null {
    // Return the edge index (0-5) if this tile is on an edge, null otherwise
    for (let i = 0; i < this.edges.length; i++) {
      for (const [eq, er] of this.edges[i]) {
        if (eq === q && er === r) {
          return i;
        }
      }
    }
    return null;
  }

  checkRing(player: Owner): boolean {
    // Check all cells on the board
    for (const [key, tile] of this.boardState) {
      if (tile.owner === 0 || tile.owner === this.getOpponent()) {
        // If this cell cannot escape, it's enclosed by a ring
        if (!this.canEmptyCellEscape(tile.q, tile.r, player)) {
          return true; // WIN!
        }
      }
    }
    return false;
  }

  private isOnBoardBoundary(q: number, r: number): boolean {
    const s = -q - r;
    const N = this.boardSize - 1;
    return Math.abs(q) === N || Math.abs(r) === N || Math.abs(s) === N;
  }

  private canEmptyCellEscape(
    startQ: number,
    startR: number,
    player: Owner
  ): boolean {
    const visited = new Set<string>();
    const queue: [number, number][] = [[startQ, startR]];
    visited.add(`${startQ},${startR}`);

    while (queue.length > 0) {
      const [q, r] = queue.shift()!;

      // If we reached the board boundary, the cell can escape
      if (this.isOnBoardBoundary(q, r)) {
        return true;
      }

      // Check all neighbors
      const neighbors = this.getNeighbors(q, r);
      for (const [nq, nr] of neighbors) {
        const key = `${nq},${nr}`;
        if (visited.has(key)) continue;

        const owner = this.getHexOwner(nq, nr);

        // Can only move through empty cells or cells NOT owned by this player
        if (owner !== player) {
          visited.add(key);
          queue.push([nq, nr]);
        }
        // If owner === player, we're blocked - don't add to queue
      }
    }

    // Never reached boundary - cell is enclosed!
    return false;
  }

  checkWin() {
    const player = this.player;
    return (
      this.checkBridge(player) ||
      this.checkFork(player) ||
      this.checkRing(player)
    );
  }
}

import type { Player } from "./Player";

export interface Game {
  gameId: string;
  player: Player;
}

export type GuessResult = "Hit" | "Miss";

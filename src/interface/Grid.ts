import type { Player } from "./Player";
export interface Square {
  letter: string | null;
  revealed: boolean;
  hasWord: boolean;
}
export interface PlayerResponse {
  player: Player;
}
export interface GridProps {
  opponent: boolean;
  grid: Square[][];
  playerData: PlayerResponse | null;
}
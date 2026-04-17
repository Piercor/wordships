import type { Player } from "./Player";

export type Square = (string | null)[][];
export interface GridProps {
  opponent: boolean;
  grid: Square;
  player: Player | null;
}
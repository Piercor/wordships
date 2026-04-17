import type { Player } from "./Player";
export interface Square {
  letter: string | null;
  revealed: boolean;
  hasWord: boolean;
}
interface Letter {
  value: string;
  found: boolean;
}
interface Word {
  name: string;
  letters: Letter[];
}
export interface PlayerResponse {
  player: Player & {
    wordList: Word[];
  };
}
export interface GridProps {
  opponent: boolean;
  grid: Square[][];
  playerData: PlayerResponse | null;
}
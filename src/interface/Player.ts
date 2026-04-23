import type { Word } from "./Word";

export interface Player {
  id: string;
  name: string;
  wordList?: Word[];
}
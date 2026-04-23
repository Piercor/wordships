import type { Square, Cell } from "../interface/Grid";
import { GRID_SIZE } from "./constants";

export function createEmptyGrid(): Square {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, (): Cell => ({
      letter: null,
      wordName: null,
      found: false
    })),
  );
}
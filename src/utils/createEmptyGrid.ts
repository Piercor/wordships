import type { Square, Cell } from "../interface/Grid";

export function createEmptyGrid(): Square {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, (): Cell => ({
      letter: null,
      wordName: null,
      found: false
    })),
  );
}
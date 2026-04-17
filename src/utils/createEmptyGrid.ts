import type { Square } from "../interface/Grid";

export function createEmptyGrid(): Square {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => null),
  );
}
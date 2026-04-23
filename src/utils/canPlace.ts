import type { Square } from "../interface/Grid";
import { GRID_SIZE } from "./constants";

export const canPlace = (
  grid: Square,
  word: string,
  row: number,
  col: number,
  horizontal: boolean
): boolean => {
  const length = word.length;
  const endRow = horizontal ? row : row + length - 1;
  const endCol = horizontal ? col + length - 1 : col;

  // Kontrollera att ordet ryms på raden/kolumnen
  if (endRow >= GRID_SIZE || endCol >= GRID_SIZE) return false;

  // Kontrollera att alla celler för ordet är lediga
  for (let i = 0; i < length; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    if (grid[r][c].letter !== null) return false;
  }

  // Kontrollera att celler ovanför/nedanför (horisontellt) eller vänster/höger (vertikalt) är lediga
  for (let i = 0; i < length; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    if (horizontal) {
      if (r > 0 && grid[r - 1][c].letter !== null) return false;
      if (r < GRID_SIZE - 1 && grid[r + 1][c].letter !== null) return false;
    } else {
      if (c > 0 && grid[r][c - 1].letter !== null) return false;
      if (c < GRID_SIZE - 1 && grid[r][c + 1].letter !== null) return false;
    }
  }

  // Kontrollera att det finns en tom cell före och efter ordet
  if (horizontal) {
    if (col > 0 && grid[row][col - 1].letter !== null) return false;
    if (endCol < GRID_SIZE - 1 && grid[row][endCol + 1].letter !== null) return false;
  } else {
    if (row > 0 && grid[row - 1][col].letter !== null) return false;
    if (endRow < GRID_SIZE - 1 && grid[endRow + 1][col].letter !== null) return false;
  }

  return true;
};
import type { Word } from "../interface/Word";
import type { Cell, Square } from "../interface/Grid";
import { createEmptyGrid } from "../utils/createEmptyGrid";

export const buildGrid = (words: Word[]): Square => {
  const grid = createEmptyGrid();

  for (const word of words) {
    for (const letter of word.letters) {
      if (letter.row < 0 || letter.col < 0) continue;
      grid[letter.row][letter.col] = {
        letter: letter.value,
        wordName: word.name,
        found: letter.found,
      };
    }
  }

  return grid;
};

interface GameGridProps {
  grid: Square;
  isOpponent: boolean;
}

const getCellClass = (cell: Cell, isOpponent: boolean): string => {
  let cellClass = "cell";

  if (isOpponent) {
    if (cell.found) cellClass += " cell-hit";
  } else {
    if (cell.letter && !cell.found) cellClass += " placed";
    if (cell.found) cellClass += " cell-found";
  }

  return cellClass;
};

export default function Grid({ grid, isOpponent }: GameGridProps) {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={getCellClass(cell, isOpponent)}
          >
            {isOpponent
              ? cell.found
                ? cell.letter
                : ""
              : (cell.letter?.toUpperCase() ?? "")}
          </div>
        )),
      )}
    </div>
  );
}

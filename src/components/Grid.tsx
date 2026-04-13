import { useState } from "react";
import "../sass/Grid.scss";

interface Square {
  letter: string | null;
  revealed: boolean;
  hasWord: boolean;
}

function createEmptyGrid(): Square[][] {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({
      letter: null,
      revealed: false,
      hasWord: false,
    }))
  );
}

export default function Grid() {
  const [grid] = useState<Square[][]>(createEmptyGrid);

  return (
    <div className="grid-container">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            className="grid-cell"
            key={`${rowIndex}-${colIndex}`}
          >
          </div>
        ))
      )}
    </div>
  );
}
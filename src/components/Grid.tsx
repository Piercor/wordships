import { useState } from "react";
import type { Square, GridProps } from "../interface/Grid";


function createEmptyGrid(): Square[][] {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({
      letter: null,
      revealed: false,
      hasWord: false,
    }))
  );
}

export default function Grid({ opponent }: GridProps) {
  const [grid] = useState<Square[][]>(createEmptyGrid);

  return (
    <div className={`grid-container ${opponent ? "grid-opponent" : "grid-own"}`}>
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
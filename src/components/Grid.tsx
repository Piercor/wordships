import type { GridProps } from "../interface/Grid";

export default function Grid({ opponent, grid }: GridProps) {
  return (
    <div className={`grid-container ${opponent ? "grid-opponent" : "grid-own"}`}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div className="grid-cell" key={`${rowIndex}-${colIndex}`}>
            {!opponent && cell.hasWord ? cell.letter : null}
            {opponent && cell.revealed ? cell.letter : null}
          </div>
        ))
      )}
    </div>
  );
}
import type { GridProps } from "../interface/Grid";

export default function Grid({ opponent, grid, player }: GridProps) {
  return (
    <>
      <p>{player?.name}</p>

      <div className={`grid ${opponent ? "grid-opponent" : "grid-own"}`}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              className="grid-cell"
              key={`${rowIndex}-${colIndex}`}
            >
              {cell}
            </div>
          ))
        )}
      </div></>
  );
}
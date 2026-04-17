import type { GridProps } from "../interface/Grid";

export default function Grid({ opponent, grid, playerData }: GridProps) {
  return (
    <div className={`grid-container ${opponent ? "grid-opponent" : "grid-own"}`}>
      <p>{playerData?.player.name}</p>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            className="grid-cell"
            key={`${rowIndex}-${colIndex}`}
          >
            {!opponent && cell.hasWord ? cell.letter : null}
            {opponent && cell.revealed ? cell.letter : null}
          </div>
        ))
      )}
    </div>
  );
}
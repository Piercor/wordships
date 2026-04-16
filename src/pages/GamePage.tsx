import Grid from "../components/Grid";
import type { Square } from "../interface/Grid";

function createEmptyGrid(): Square[][] {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({
      letter: null,
      revealed: false,
      hasWord: false,
    }))
  );
}

export default function GamePage() {
  const ownGrid = createEmptyGrid();
  const opponentGrid = createEmptyGrid();

  return (
    <div className="game-page">
      <Grid opponent={false} grid={ownGrid} />
      <Grid opponent={true} grid={opponentGrid} />
    </div>
  );
}
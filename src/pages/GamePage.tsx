import Grid from "../components/Grid";
import { useGame } from "../context/GameContext";
import type { Square } from "../interface/Grid";

function createEmptyGrid(): Square {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => null)
  );
}

export default function GamePage() {
  const { player, opponent } = useGame();
  const ownGrid = createEmptyGrid();
  const opponentGrid = createEmptyGrid();

  return (
    <main>
      <div className="card">
        <div className="game-page">
          <Grid opponent={false} grid={ownGrid} player={player} />
          <Grid opponent={true} grid={opponentGrid} player={opponent} />
        </div>
      </div>
    </main>
  );
}
import Grid from "../components/Grid";
import { useGame } from "../context/GameContext";
import { createEmptyGrid } from "../utils/createEmptyGrid";

export default function GamePage() {
  const { player, opponent } = useGame();
  const ownGrid = createEmptyGrid();
  const opponentGrid = createEmptyGrid();

  return (
    <main className="game-main">
      <div className="card">
        <div className="game-page">
          <Grid opponent={false} grid={ownGrid} player={player} />
          <Grid opponent={true} grid={opponentGrid} player={opponent} />
        </div>
      </div>
    </main>
  );
}

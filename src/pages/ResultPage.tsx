import { useGame } from "../context/GameContext";

export default function ResultPage() {
  const { player, winner, resetGame } = useGame();
  const didWin = winner?.id === player?.id;

  return (
    <main>
      <div className="card">
        <div className="result-page">
          <h1 className="heading">{didWin ? "You won!" : "You lost!"}</h1>
          <p className="winner-name">
            Winner: {winner?.name}
          </p>
          <button data-testid="reset-game-btn" className="button" onClick={resetGame}>
            Play again
          </button>
        </div>
      </div>
    </main>
  );
}
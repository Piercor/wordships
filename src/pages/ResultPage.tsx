import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useGame } from "../context/GameContext";

export default function ResultPage() {
  const { player, winner, resetGame } = useGame();
  const didWin = winner?.id === player?.id;

  useEffect(() => {
    if (!didWin) return;

    confetti({ angle: 60, spread: 70, origin: { x: 0 } });
    confetti({ angle: 120, spread: 70, origin: { x: 1 } });
  }, []);

  return (
    <main>
      {!didWin && (
        <div className="rain">
          <span className="rain-drop">😢</span>
          <span className="rain-drop">😭</span>
          <span className="rain-drop">💔</span>
          <span className="rain-drop">😢</span>
          <span className="rain-drop">😭</span>
        </div>
      )}
      <div className={`card result-card ${didWin ? "win" : "lose"}`}>
        <div className="result-page">
          <h1 className="heading">{didWin ? "You won!" : "You lost!"}</h1>
          <p className="winner-name">Winner: {winner?.name}</p>
          <button
            data-testid="reset-game-btn"
            className="button"
            onClick={resetGame}
          >
            Play again
          </button>
        </div>
      </div>
    </main>
  );
}
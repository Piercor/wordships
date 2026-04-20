import { useGame } from "../context/GameContext";

export default function ResultPage() {
  const { player, winner } = useGame();

  const didWin = winner?.id === player?.id;

  return (
    <main>
      <div className="card">
        <div className="result-page">
          <h1>{didWin ? "You won!" : "You lost!"}</h1>
          <p>
            Winner: <strong>{winner?.name}</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
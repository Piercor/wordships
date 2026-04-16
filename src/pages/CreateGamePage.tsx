import { useState } from "react";
import { useGame } from "../context/GameContext";
import type { Game } from "../interface/Game";

const CreateGamePage = () => {
  const { player, createGame, error, loading, setGameId } = useGame();
  const [gameCreated, setGameCreated] = useState<Game | null>(null);

  const handleCreateGame = async () => {
    const result = await createGame();
    if (result) {
      setGameCreated(result);
    }
  };

  if (gameCreated) {
    return (
      <div>
        <h2>Game Created!</h2>
        <div className="success">
          <p>
            Your game has been created. Share the Game ID with your opponent:
          </p>
        </div>

        <div className="info-box">
          <p>
            <strong>Game ID:</strong>
            <br />
            <span className="code">{gameCreated.gameId}</span>
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(gameCreated.gameId)}
          >
            Copy Game ID
          </button>
        </div>

        <div className="info-box">
          <p>Waiting for your opponent to join...</p>
          <button
            onClick={() => {
              setGameId(gameCreated.gameId);
              window.location.reload();
            }}
          >
            Refresh to see if they've joined
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div data-testid="create-page">
        <h2>Create New Game</h2>

        {error && <div className="error">{error}</div>}

        <div className="info-box">
          <p>
            Playing as: <strong>{player?.name}</strong>
          </p>
        </div>

        <button
          data-testid="create-game-btn"
          onClick={handleCreateGame}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Game"}
        </button>

        <p className="info-box-p">
          You'll be Player 1. Share the generated Game ID with Player 2 to join.
        </p>
      </div>
    </div>
  );
};

export default CreateGamePage;

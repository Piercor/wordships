import { useState, type ChangeEvent } from "react";
import { useGame } from "../context/GameContext";

const JoinGamePage = () => {
  const { player, joinGame, error, loading } = useGame();
  const [gameId, setGameId] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoinGame = async (e: ChangeEvent) => {
    e.preventDefault();
    if (!gameId.trim()) {
      return;
    }

    const result = await joinGame(gameId);
    if (result) {
      setJoined(true);
    }
  };

  if (joined) {
    return (
      <div>
        <h2>Game Joined!</h2>
        <div className="success">
          <p>You've successfully joined the game.</p>
        </div>

        <div className="info-box">
          <p>
            Playing as: <strong>{player?.name}</strong>
          </p>
        </div>

        <p className="info-box-p">
          The game will start once both players are present. Refresh to enter
          the game.
        </p>

        <button onClick={() => window.location.reload()}>Enter Game</button>
      </div>
    );
  }

  return (
    <div data-testid="join-page">
      <h2>Join Game</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleJoinGame}>
        <div className="form-group">
          <label htmlFor="gameId">Game ID</label>
          <input
            data-testid="join-game-id-input"
            id="gameId"
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Paste the Game ID from your opponent"
            autoFocus
          />
        </div>

        <button
          data-testid="join-game-btn"
          type="submit"
          disabled={!gameId.trim()}
        >
          {loading ? "Joining..." : "Join Game"}
        </button>
      </form>

      <div className="info-box">
        <p>
          Playing as: <strong>{player?.name}</strong>
        </p>
      </div>
    </div>
  );
};

export default JoinGamePage;

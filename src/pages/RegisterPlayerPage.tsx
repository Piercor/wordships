import { useState } from "react";
import { useGame } from "../context/GameContext";

const RegisterPlayerPage = () => {
  const { registerPlayer } = useGame();
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setError("You must enter a name");
      return;
    }

    registerPlayer(playerName);
    setError("");
  };

  return (
    <main data-testid="register-page">
      <div className="card">
        <div className="register-header">
          <h1>
            <img
              src="https://8upload.com/image/ff8d99e3244799c9/Wordships-grey.png"
              alt="Wordship"
              className="logo"
            />
          </h1>
        </div>
        <h2>Register Player</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="playerName">Your Name</label>
            <input
              data-testid="player-name-input"
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your player name"
              autoFocus
            />
          </div>

          <button data-testid="register-continue" type="submit">
            Continue
          </button>
        </form>

        <div className="info-box">
          <p>
            A unique player ID will be created for you when you create or join a
            game.
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPlayerPage;

import { useEffect, useState } from "react";
import Grid, { buildGrid } from "../components/Grid";
import { useGame } from "../context/GameContext";
import type { Square } from "../interface/Grid";
import { createEmptyGrid } from "../utils/createEmptyGrid";

export default function GamePage() {
  const { player, opponent, playerWords, opponentWords, guessLetter, turn } =
    useGame();
  const [playerGrid, setPlayerGrid] = useState<Square>(createEmptyGrid);
  const [opponentGrid, setOpponentGrid] = useState<Square>(createEmptyGrid);

  const [guessedLetters, setGuessedLetters] = useState<string[]>(() => {
    const saved = sessionStorage.getItem("guessedLetters");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");

  const isMyTurn = turn === player?.id;

  useEffect(() => {
    setPlayerGrid(buildGrid(playerWords));
  }, [playerWords]);

  useEffect(() => {
    setOpponentGrid(buildGrid(opponentWords));
  }, [opponentWords]);

  useEffect(() => {
    sessionStorage.setItem("guessedLetters", JSON.stringify(guessedLetters));
  }, [guessedLetters]);

  const handleGuess = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const letter = input.toLowerCase().trim();
    if (!letter || letter.length !== 1) return;

    if (guessedLetters.includes(letter)) {
      setInputError("You have already guessed this letter");
      return;
    }

    const data = await guessLetter(letter);

    setGuessedLetters([...guessedLetters, letter]);
    setInput("");

    if (data === "Hit") {
      setOpponentGrid((prev) =>
        prev.map((row) =>
          row.map((cell) =>
            cell.letter === letter ? { ...cell, found: true } : cell,
          ),
        ),
      );
    }
  };

  const completedWordNames = new Set(
    opponentGrid
      .flat()
      .filter((cell) => cell.letter && !cell.found)
      .map((cell) => cell.wordName),
  );

  const completedWords = opponentWords.length - completedWordNames.size;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z]$/.test(value) || value === "") {
      setInput(value);
      setInputError("");
    } else {
      setInputError("Only letters (A-Z) are allowed");
    }
  };

  return (
    <main className="game-main">
      <div className="card">
        <div className="game-page">
          <div className="grids">
            <div data-testid="player-grid">
              <h2>My Board</h2>
              <p className="board-subtitle">{player?.name}</p>
              <Grid grid={playerGrid} isOpponent={false} />
            </div>
            <div data-testid="opponent-grid">
              <h2>Opponent's Board</h2>
              <p className="board-subtitle">{opponent?.name}</p>
              <Grid grid={opponentGrid} isOpponent={true} />
            </div>
          </div>

          <div className="game-controls">
            <span className={`turn-indicator${isMyTurn ? "" : " waiting"}`}>
              {isMyTurn ? "Your turn!" : "Waiting for opponent..."}
            </span>

            <form onSubmit={handleGuess} className="guess-form">
              <input
                data-testid="guess-input"
                type="text"
                maxLength={1}
                value={input}
                onChange={handleInputChange}
                disabled={!isMyTurn}
              />
              <button
                type="submit"
                data-testid="guess-btn"
                disabled={!isMyTurn}
              >
                Guess
              </button>
            </form>
            {inputError && <p className="error">{inputError}</p>}

            <div className="guessed-letters" data-testid="guessed-letters">
              <span className="guessed-label">Guessed letters:</span>
              {guessedLetters.map((letter) => (
                <span key={letter} className="guessed-letter">
                  {letter}
                </span>
              ))}
            </div>
          </div>

          <div className="game-status">
            <span className="status-badge found">
              {completedWords} words found
            </span>
            <span className="status-badge left">
              {opponentWords.length - completedWords} words left
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

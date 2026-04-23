import { useEffect, useState } from "react";
import Grid, { buildGrid } from "../components/Grid";
import { useGame } from "../context/GameContext";
import type { Square } from "../interface/Grid";
import { createEmptyGrid } from "../utils/createEmptyGrid";

export default function GamePage() {
  const { player, opponent, playerWords, opponentWords, guessLetter, guessWord, turn } =
    useGame();
  const [playerGrid, setPlayerGrid] = useState<Square>(createEmptyGrid);
  const [opponentGrid, setOpponentGrid] = useState<Square>(createEmptyGrid);

  const [guessedLetters, setGuessedLetters] = useState<string[]>(() => {
    const saved = sessionStorage.getItem("guessedLetters");
    return saved ? JSON.parse(saved) : [];
  });

  const [guessedWords, setGuessedWords] = useState<string[]>(() => {
    const saved = sessionStorage.getItem("guessedWords");
    return saved ? JSON.parse(saved) : [];
  });

  const [letterInput, setLetterInput] = useState("");
  const [letterInputError, setLetterInputError] = useState("");

  const [wordInput, setWordInput] = useState("");
  const [wordInputError, setWordInputError] = useState("");

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

  useEffect(() => {
    sessionStorage.setItem("guessedWords", JSON.stringify(guessedWords));
  }, [guessedWords]);


  const handleLetterGuess = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const letter = letterInput.toLowerCase().trim();
    if (!letter || letter.length !== 1) return;

    if (guessedLetters.includes(letter)) {
      setLetterInputError("You have already guessed this letter");
      return;
    }

    const data = await guessLetter(letter);

    setGuessedLetters([...guessedLetters, letter]);
    setLetterInput("");

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

  const handleWordGuess = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const word = wordInput.toLowerCase().trim();
    if (!word || word.length < 3 || word.length > 6) return;

    if (guessedWords.includes(word)) {
      setWordInputError("You have already guessed this word");
      return;
    }

    const data = await guessWord(word);

    setGuessedWords([...guessedWords, word]);
    setWordInput("");

    if (data === "Hit") {
      setOpponentGrid((prev) =>
        prev.map((row) =>
          row.map((cell) =>
            cell.wordName === word ? { ...cell, found: true } : cell,
          ),
        ),
      );
    }
    if (data === "Miss") {
      setPlayerGrid((prev) =>
        prev.map((row) =>
          row.map((cell) =>
            cell.wordName === word ? { ...cell, found: true } : cell,
          ),),);
      setOpponentGrid((prev) =>
        prev.map((row) =>
          row.map((cell) =>
            cell.wordName === word ? { ...cell, found: true } : cell,
          ),),);
    }
  };


  const completedWordNames = new Set(
    opponentGrid
      .flat()
      .filter((cell) => cell.letter && !cell.found)
      .map((cell) => cell.wordName),
  );

  const completedWords = opponentWords.length - completedWordNames.size;

  const handleLetterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z]$/.test(value) || value === "") {
      setLetterInput(value);
      setLetterInputError("");
    } else {
      setLetterInputError("Only letters (A-Z) are allowed");
    }
  };

  const handleWordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z]{1,6}$/.test(value) || value === "") {
      setWordInput(value);
      setWordInputError("");
    } else {
      setWordInputError("Max 6 letters (A-Z) are allowed");
    }
  };

  return (
    <main className="game-main">
      <div className="card">
        <div className="game-page">
          <div className="grids">
            <div data-testid="opponent-grid">
              <h2>Opponent's Board</h2>
              <p className="board-subtitle">{opponent?.name}</p>
              <Grid grid={opponentGrid} isOpponent={true} />
            </div>
            <div>
              <div data-testid="player-grid">
                <h2>My Board</h2>
                <p className="board-subtitle">{player?.name}</p>
                <Grid grid={playerGrid} isOpponent={false} />
              </div>
            </div>
          </div>

          <div className="game-controls">
            <span className={`turn-indicator${isMyTurn ? "" : " waiting"}`}>
              {isMyTurn ? "Your turn!" : "Waiting for opponent..."}
            </span>

            <form onSubmit={handleLetterGuess} className="guess-letter-form">
              <input
                data-testid="guess-input"
                type="text"
                minLength={1}
                value={letterInput}
                onChange={handleLetterInputChange}
                disabled={!isMyTurn}
              />
              <button
                type="submit"
                data-testid="guess-btn"
                disabled={!isMyTurn}
              >
                Guess letter
              </button>
            </form>
            {letterInputError && <p className="error">{letterInputError}</p>}

            <div className="guessed-letters" data-testid="guessed-letters">
              <span className="guessed-label">Guessed letters:</span>
              {guessedLetters.map((letter) => (
                <span key={letter} className="guessed-letter">
                  {letter}
                </span>
              ))}
            </div>

            <form onSubmit={handleWordGuess} className="guess-word-form">
              <input
                data-testid="guess-input"
                type="text"
                minLength={3}
                value={wordInput}
                onChange={handleWordInputChange}
                disabled={!isMyTurn}
              />
              <button
                type="submit"
                data-testid="guess-btn"
                disabled={!isMyTurn}
              >
                Guess word
              </button>
            </form>
            {wordInputError && <p className="error">{wordInputError}</p>}

            <div className="guessed-words" data-testid="guessed-words">
              <span className="guessed-label">Guessed words:</span>
              {guessedWords.map((word) => (
                <span key={word} className="guessed-word">
                  {word}
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

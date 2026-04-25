import { useEffect, useState } from "react";
import Grid, { buildGrid } from "../components/Grid";
import { useGame } from "../context/GameContext";
import type { Square } from "../interface/Grid";
import { createEmptyGrid } from "../utils/createEmptyGrid";

export default function GamePage() {
  const {
    player,
    opponent,
    playerWords,
    opponentWords,
    guessLetter,
    guessWord,
    turn,
  } = useGame();
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

  const [letterWord, setLetterWord] = useState<boolean>(true);

  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");

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
      setToastMessage("Hit 😁");
      triggerToast(3000);
    } else {
      setToastMessage("Miss 😢");
      triggerToast(3000);
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
      setToastMessage("Hit 😎");
      triggerToast(3000);
    }
    if (data === "Miss") {
      setPlayerGrid((prev) =>
        prev.map((row) =>
          row.map((cell) =>
            cell.wordName === word ? { ...cell, found: true } : cell,
          ),
        ),
      );
      setOpponentGrid((prev) =>
        prev.map((row) =>
          row.map((cell) =>
            cell.wordName === word ? { ...cell, found: true } : cell,
          ),
        ),
      );
      setToastMessage("Miss 😭 Now one of your letters would be revealed to your opponent!");
      triggerToast(5000);
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

  function triggerToast(time: number) {
    setToast(true);

    const timer = setTimeout(() => {
      setToast(false);
      setToastMessage("");
    }, time);
  }

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

            <div className="guess-tabs">
              <button
                data-testid="tab-letter"
                className={`guess-tab${letterWord ? " active" : ""}`}
                onClick={() => {
                  setLetterWord(true);
                  setLetterInputError("");
                  setWordInputError("");
                  setLetterInput("");
                  setWordInput("");
                }}
              >
                Letter
              </button>
              <button
                data-testid="tab-word"
                className={`guess-tab${!letterWord ? " active" : ""}`}
                onClick={() => {
                  setLetterWord(false);
                  setLetterInputError("");
                  setWordInputError("");
                  setLetterInput("");
                  setWordInput("");
                }}
              >
                Word
              </button>
            </div>

            {letterWord ? (
              <form className="guess-form" onSubmit={handleLetterGuess}>
                <input
                  data-testid="guess-input-letter"
                  type="text"
                  aria-label="Guess a letter"
                  name="letter"
                  maxLength={1}
                  value={letterInput}
                  onChange={handleLetterInputChange}
                  disabled={!isMyTurn}
                />
                <button
                  type="submit"
                  data-testid="guess-btn-letter"
                  disabled={!isMyTurn}
                >
                  Guess
                </button>
              </form>
            ) : (
              <form onSubmit={handleWordGuess} className="guess-form">
                <input
                  data-testid="guess-input-word"
                  type="text"
                  name="word"
                  aria-label="Guess a word"
                  minLength={3}
                  maxLength={6}
                  value={wordInput}
                  onChange={handleWordInputChange}
                  disabled={!isMyTurn}
                />
                <button
                  type="submit"
                  data-testid="guess-btn-word"
                  disabled={!isMyTurn}
                >
                  Guess
                </button>
              </form>
            )}

            {letterWord
              ? letterInputError && <p className="error">{letterInputError}</p>
              : wordInputError && <p className="error">{wordInputError}</p>}

            <div className="guessed-list" data-testid="guessed-list">
              <span className="guessed-label">Guessed:</span>
              {guessedLetters.map((letter) => (
                <span key={letter} className="guessed-letter">
                  {letter}
                </span>
              ))}
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
        <div className={`toast ${toast ? "toast--visible" : ""}`} data-testid="toast">
          {toastMessage}
        </div>
      </div>
    </main>
  );
}

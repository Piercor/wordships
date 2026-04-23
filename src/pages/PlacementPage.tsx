import { useState } from "react";
import { useGame } from "../context/GameContext";
import type { Word } from "../interface/Word";
import type { Placement } from "../interface/Placement";
import type { Square } from "../interface/Grid";
import { createEmptyGrid } from "../utils/createEmptyGrid";
import { canPlace } from "../utils/canPlace";
import PlacementGrid from "../components/PlacementGrid";

const PlacementPage = () => {
  const { playerWords, setReady, error } = useGame();
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedPlacedWord, setSelectedPlacedWord] = useState<string | null>(
    null,
  );
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [grid, setGrid] = useState<Square>(createEmptyGrid);

  const [horizontal, setHorizontal] = useState<boolean>(true);

  const placedWords = placements.map((p) => p.wordName);
  const wordsLeft = playerWords.filter(
    (word) => !placedWords.includes(word.name),
  );
  const allWordsPlaced = wordsLeft.length === 0;

  const handleCellClick = (row: number, col: number) => {
    const cell = grid[row][col];

    if (cell.letter !== null) {
      setSelectedPlacedWord(cell.wordName);
      setSelectedWord(null);
      return;
    }
    if (!selectedWord) {
      setSelectedPlacedWord(null);
      return;
    }

    if (!canPlace(grid, selectedWord.name, row, col, horizontal)) return;

    const newGrid = grid.map((r) => [...r]);
    // Kopiera grid och placera ut bokstäverna
    for (let i = 0; i < selectedWord.name.length; i++) {
      if (horizontal) {
        newGrid[row][col + i] = {
          letter: selectedWord.name[i],
          wordName: selectedWord.name,
          found: false,
        };
      } else {
        newGrid[row + i][col] = {
          letter: selectedWord.name[i],
          wordName: selectedWord.name,
          found: false,
        };
      }
    }

    setGrid(newGrid);
    setPlacements([
      ...placements,
      { wordName: selectedWord.name, row, col, horizontal },
    ]);
    setSelectedWord(null);
  };

  const handleRemoveWord = () => {
    if (!selectedPlacedWord) return;

    const newGrid = grid.map((row) =>
      row.map((cell) =>
        cell.wordName === selectedPlacedWord
          ? { letter: null, wordName: null, found: false }
          : cell,
      ),
    );

    setGrid(newGrid);
    setPlacements(
      placements.filter((place) => place.wordName !== selectedPlacedWord),
    );
    setSelectedPlacedWord(null);
  };

  const handleReady = async () => {
    if (!allWordsPlaced) return;
    await setReady(placements);
  };

  return (
    <main onClick={() => setSelectedPlacedWord(null)}>
      <div className="card">
        <div className="placement-page">
          <h2>Place your words</h2>

          {error && <div className="error">{error}</div>}

          <div className="placement-words">
            {playerWords.map((word) => (
              <button
                data-testid="word-button"
                key={word.name}
                onClick={() =>
                  !placedWords.includes(word.name) && setSelectedWord(word)
                }
                disabled={placedWords.includes(word.name)}
                className={selectedWord?.name === word.name ? "selected" : ""}
              >
                {word.name.toUpperCase()}
              </button>
            ))}
          </div>
          <p className="placement-info">
            {selectedWord && (
              <>
                Place word: <strong>{selectedWord.name.toUpperCase()}</strong>
                <button
                  className="hv-btn"
                  onClick={() => setHorizontal(!horizontal)}
                >
                  {horizontal ? "➡" : "⬇"}
                </button>
              </>
            )}
          </p>

          <PlacementGrid
            grid={grid}
            placements={placements}
            selectedWord={selectedWord}
            selectedPlacedWord={selectedPlacedWord}
            horizontal={horizontal}
            onCellClick={handleCellClick}
            onRemove={handleRemoveWord}
          />

          <button
            onClick={handleReady}
            disabled={!allWordsPlaced}
            data-testid="ready-btn"
          >
            {!allWordsPlaced
              ? `${wordsLeft.length} words left to place`
              : "Ready!"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default PlacementPage;

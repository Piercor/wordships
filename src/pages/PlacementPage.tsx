import { useState } from "react";
import { useGame } from "../context/GameContext";
import type { Word } from "../interface/Word";
import type { Placement, PlacementGrid } from "../interface/Placement";

const GRID_SIZE = 10;

const createEmptyGrid = (): PlacementGrid => {
  const grid = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    const newRow = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      newRow.push(null);
    }
    grid.push(newRow);
  }
  return grid;
};

const PlacementPage = () => {
  const { playerWords, setReady, error } = useGame();
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [grid, setGrid] = useState<PlacementGrid>(createEmptyGrid);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  // Lista med namn på redan placerade ord
  const placedWords = placements.map((p) => p.wordName);

  // Ord som inte har placerats än
  const wordsLeft = playerWords.filter(
    (word) => !placedWords.includes(word.name),
  );

  const allWordsPlaced = wordsLeft.length === 0;

  //Kollar om en cell ska markeras när man hovrar;
  const getPreviewState = (rowIndex: number, colIndex: number) => {
    if (!selectedWord || hoverCol === null || hoverRow !== rowIndex)
      return null;
    if (colIndex < hoverCol || colIndex >= hoverCol + selectedWord.name.length)
      return null;
    const wordFits = canPlace(grid, selectedWord.name, hoverRow, hoverCol);
    return wordFits ? "valid" : "invalid";
  };

  // Kollar om ett ord kan placeras på en given rad och kolumn
  const canPlace = (
    grid: PlacementGrid,
    word: string,
    row: number,
    col: number,
  ): boolean => {
    const start = col;
    const end = col + word.length - 1;

    // Kontrollera att ordet ryms på raden
    if (end >= GRID_SIZE) return false;

    // Kontrollera att cellerna under ordet är lediga
    for (let i = 0; i < word.length; i++) {
      if (grid[row][col + i] !== null) return false;
    }

    // Kontrollera att det finns en tom cell till vänster om ordet
    if (start > 0 && grid[row][start - 1] !== null) return false;

    // Kontrollera att det finns en tom cell till höger om ordet
    if (end < GRID_SIZE - 1 && grid[row][end + 1] !== null) return false;

    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (!selectedWord) return;
    if (!canPlace(grid, selectedWord.name, row, col)) return;

    // Kopiera grid och placera ut bokstäverna
    const newGrid = grid.map((r) => [...r]);
    for (let i = 0; i < selectedWord.name.length; i++) {
      newGrid[row][col + i] = selectedWord.name[i];
    }

    setGrid(newGrid);
    setPlacements([...placements, { wordName: selectedWord.name, row, col }]);
    setSelectedWord(null);
  };

  const handleReady = async () => {
    if (!allWordsPlaced) return;
    await setReady(placements);
  };

  return (
    <main>
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
              </>
            )}
          </p>

          <div data-testid="placement-grid" className="grid">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                // Hämta status för denna cell
                const previewState = getPreviewState(rowIndex, colIndex);

                // Räkna ut vilken bokstav som ska visas när man hovrar i cellen
                const previewLetter =
                  previewState === "valid" && hoverCol !== null
                    ? selectedWord!.name[colIndex - hoverCol].toUpperCase()
                    : null;
                return (
                  <div
                    key={rowIndex * GRID_SIZE + colIndex}
                    className={`cell${cell ? " placed" : ""}${previewState === "valid" ? " preview" : ""}${previewState === "invalid" ? " invalid" : ""}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onMouseEnter={() => {
                      setHoverCol(colIndex);
                      setHoverRow(rowIndex);
                    }}
                    onMouseLeave={() => {
                      setHoverCol(null);
                      setHoverRow(null);
                    }}
                  >
                    {cell?.toUpperCase() ?? previewLetter ?? ""}
                  </div>
                );
              }),
            )}
          </div>

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

import { useState } from "react";
import { useGame } from "../context/GameContext";
import type { Word } from "../interface/Word";
import type { Placement } from "../interface/Placement";
import type { Square } from "../interface/Grid";
import { createEmptyGrid } from "../utils/createEmptyGrid";
import { GRID_SIZE } from "../utils/constants";

const PlacementPage = () => {
  const { playerWords, setReady, error } = useGame();
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [grid, setGrid] = useState<Square>(createEmptyGrid);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [horizontal, setHorizontal] = useState<boolean>(true);

  const placedWords = placements.map((p) => p.wordName);
  const wordsLeft = playerWords.filter(
    (word) => !placedWords.includes(word.name),
  );
  const allWordsPlaced = wordsLeft.length === 0;

  //Kollar om en cell ska markeras när man hovrar;
  const getPreviewState = (rowIndex: number, colIndex: number) => {
    if (!selectedWord || hoverCol === null || hoverRow === null)
      return null;
    const length = selectedWord.name.length;
    const inPlace = horizontal ? rowIndex === hoverRow && colIndex >= hoverCol && colIndex < hoverCol + length
      : colIndex === hoverCol && rowIndex >= hoverRow && rowIndex < hoverRow + length;
    if (!inPlace) return null;

    return canPlace(grid, selectedWord.name, hoverRow, hoverCol) ? "valid" : "invalid";
  };

  // Kollar om ett ord kan placeras på en given rad och kolumn
  const canPlace = (
    grid: Square,
    word: string,
    row: number,
    col: number,
  ): boolean => {
    const length = word.length;

    if (horizontal) {
      const endCol = col + length - 1;

      // Kontrollera att ordet ryms på raden
      if (endCol >= GRID_SIZE) return false;

      // Kontrollera att alla celler för ordet är lediga
      for (let i = 0; i < length; i++) {
        if (grid[row][col + i].letter !== null) return false;
      }

      // Kontrollera att celler ovanför och nedanför varje bokstav är lediga (med boundary checks)
      for (let i = 0; i < length; i++) {
        const currentCol = col + i;
        if (row > 0 && grid[row - 1][currentCol].letter !== null) return false; // Above
        if (row < GRID_SIZE - 1 && grid[row + 1][currentCol].letter !== null) return false; // Below
      }

      // Kontrollera att det finns en tom cell till vänster om ordet (om möjligt)
      if (col > 0 && grid[row][col - 1].letter !== null) return false;

      // Kontrollera att det finns en tom cell till höger om ordet (om möjligt)
      if (endCol < GRID_SIZE - 1 && grid[row][endCol + 1].letter !== null) return false;

      // NY: Förhindra diagonal adjacency vid första och sista bokstaven
      // Första bokstaven (row, col)
      if (row > 0 && col > 0 && grid[row - 1][col - 1].letter !== null) return false; // Top-left
      if (row > 0 && col < GRID_SIZE - 1 && grid[row - 1][col + 1].letter !== null) return false; // Top-right
      if (row < GRID_SIZE - 1 && col > 0 && grid[row + 1][col - 1].letter !== null) return false; // Bottom-left
      if (row < GRID_SIZE - 1 && col < GRID_SIZE - 1 && grid[row + 1][col + 1].letter !== null) return false; // Bottom-right

      // Sista bokstaven (row, endCol)
      if (row > 0 && endCol > 0 && grid[row - 1][endCol - 1].letter !== null) return false; // Top-left
      if (row > 0 && endCol < GRID_SIZE - 1 && grid[row - 1][endCol + 1].letter !== null) return false; // Top-right
      if (row < GRID_SIZE - 1 && endCol > 0 && grid[row + 1][endCol - 1].letter !== null) return false; // Bottom-left
      if (row < GRID_SIZE - 1 && endCol < GRID_SIZE - 1 && grid[row + 1][endCol + 1].letter !== null) return false; // Bottom-right

      return true;
    } else {
      // Vertical placement
      const endRow = row + length - 1;

      // Kontrollera att ordet ryms på kolumnen
      if (endRow >= GRID_SIZE) return false;

      // Kontrollera att alla celler för ordet är lediga
      for (let i = 0; i < length; i++) {
        if (grid[row + i][col].letter !== null) return false;
      }

      // Kontrollera att celler till vänster och höger om varje bokstav är lediga (med boundary checks)
      for (let i = 0; i < length; i++) {
        const currentRow = row + i;
        if (col > 0 && grid[currentRow][col - 1].letter !== null) return false; // Left
        if (col < GRID_SIZE - 1 && grid[currentRow][col + 1].letter !== null) return false; // Right
      }

      // Kontrollera att det finns en tom cell ovanför ordet (om möjligt)
      if (row > 0 && grid[row - 1][col].letter !== null) return false;

      // Kontrollera att det finns en tom cell nedanför ordet (om möjligt)
      if (endRow < GRID_SIZE - 1 && grid[endRow + 1][col].letter !== null) return false;

      // NY: Förhindra diagonal adjacency vid första och sista bokstaven
      // Första bokstaven (row, col)
      if (row > 0 && col > 0 && grid[row - 1][col - 1].letter !== null) return false; // Top-left
      if (row > 0 && col < GRID_SIZE - 1 && grid[row - 1][col + 1].letter !== null) return false; // Top-right
      if (row < GRID_SIZE - 1 && col > 0 && grid[row + 1][col - 1].letter !== null) return false; // Bottom-left
      if (row < GRID_SIZE - 1 && col < GRID_SIZE - 1 && grid[row + 1][col + 1].letter !== null) return false; // Bottom-right

      // Sista bokstaven (endRow, col)
      if (endRow > 0 && col > 0 && grid[endRow - 1][col - 1].letter !== null) return false; // Top-left
      if (endRow > 0 && col < GRID_SIZE - 1 && grid[endRow - 1][col + 1].letter !== null) return false; // Top-right
      if (endRow < GRID_SIZE - 1 && col > 0 && grid[endRow + 1][col - 1].letter !== null) return false; // Bottom-left
      if (endRow < GRID_SIZE - 1 && col < GRID_SIZE - 1 && grid[endRow + 1][col + 1].letter !== null) return false; // Bottom-right

      return true;
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (!selectedWord) return;
    if (!canPlace(grid, selectedWord.name, row, col)) return;

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
    setPlacements([...placements, { wordName: selectedWord.name, row, col, horizontal }]);
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
                {placedWords.includes(word.name) ? <div className="replace-btn" >X</div> : <></>}
              </button>
            ))}
          </div>
          <p className="placement-info">
            {selectedWord && (
              <>
                Place word: <strong>{selectedWord.name.toUpperCase()}</strong>
                <button className="hv-btn" onClick={() => horizontal ? setHorizontal(false) : setHorizontal(true)}>
                  {horizontal ? '➡' : '⬇'}</button>
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
                  previewState === "valid" && hoverCol !== null && hoverRow !== null
                    ? (horizontal ? selectedWord!.name[colIndex - hoverCol].toUpperCase() : selectedWord!.name[rowIndex - hoverRow].toUpperCase())
                    : null;
                return (
                  <div
                    key={rowIndex * GRID_SIZE + colIndex}
                    className={`cell${cell.letter ? " placed" : ""}${previewState === "valid" ? " preview" : ""}${previewState === "invalid" ? " invalid" : ""}`}
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
                    {cell?.letter?.toUpperCase() ?? previewLetter ?? ""}
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

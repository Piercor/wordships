import { useState } from "react";
import type { Square } from "../interface/Grid";
import type { Placement } from "../interface/Placement";
import type { Word } from "../interface/Word";
import { GRID_SIZE } from "../utils/constants";
import { canPlace } from "../utils/canPlace";

interface PlacementGridProps {
  grid: Square;
  placements: Placement[];
  selectedWord: Word | null;
  selectedPlacedWord: string | null;
  horizontal: boolean;
  onCellClick: (row: number, col: number) => void;
  onRemove: () => void;
}

const PlacementGrid = ({
  grid,
  placements,
  selectedWord,
  selectedPlacedWord,
  horizontal,
  onCellClick,
  onRemove,
}: PlacementGridProps) => {
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  const getPreviewState = (rowIndex: number, colIndex: number) => {
    if (!selectedWord || hoverCol === null || hoverRow === null) return null;
    const length = selectedWord.name.length;
    const inPlace = horizontal
      ? rowIndex === hoverRow &&
        colIndex >= hoverCol &&
        colIndex < hoverCol + length
      : colIndex === hoverCol &&
        rowIndex >= hoverRow &&
        rowIndex < hoverRow + length;
    if (!inPlace) return null;

    return canPlace(grid, selectedWord.name, hoverRow, hoverCol, horizontal)
      ? "valid"
      : "invalid";
  };

  return (
    <div data-testid="placement-grid" className="grid">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const previewState = getPreviewState(rowIndex, colIndex);

          const previewLetter =
            previewState !== null && hoverCol !== null && hoverRow !== null
              ? horizontal
                ? selectedWord!.name[colIndex - hoverCol].toUpperCase()
                : selectedWord!.name[rowIndex - hoverRow].toUpperCase()
              : null;

          const isWordHovered =
            !selectedWord &&
            hoverRow !== null &&
            hoverCol !== null &&
            cell.letter !== null &&
            grid[hoverRow]?.[hoverCol]?.wordName === cell.wordName;

          return (
            <div
              key={rowIndex * GRID_SIZE + colIndex}
              className={`cell${cell.letter ? " placed" : ""}${previewState === "valid" ? " preview" : ""}${previewState === "invalid" ? " invalid" : ""}${isWordHovered ? " word-hover" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onCellClick(rowIndex, colIndex);
              }}
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
              {selectedPlacedWord === cell.wordName &&
                cell.letter &&
                colIndex ===
                  placements.find((p) => p.wordName === selectedPlacedWord)
                    ?.col &&
                rowIndex ===
                  placements.find((p) => p.wordName === selectedPlacedWord)
                    ?.row && (
                  <div className="remove-popup" data-testid="remove-popup">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
            </div>
          );
        }),
      )}
    </div>
  );
};

export default PlacementGrid;

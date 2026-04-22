export interface Cell {
  letter: string | null;
  wordName: string | null;
  found: boolean;
}

export type Square = Cell[][];

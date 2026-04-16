export interface Square {
  letter: string | null;
  revealed: boolean;
  hasWord: boolean;
}
export interface GridProps {
  opponent: boolean;
  grid: Square[][];
}
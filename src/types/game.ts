export interface WordSearchGame {
  grid: string[][];
  words: Word[];
  foundWords: Set<string>;
  selectedCells: Position[];
  isSelecting: boolean;
  score: number;
  timeElapsed: number;
  isCompleted: boolean;
}

export interface Word {
  text: string;
  category: string;
  positions: Position[];
  found: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface GameSettings {
  gridSize: number;
  difficulty: 'easy' | 'medium' | 'hard';
  categories: string[];
}

export type Direction = 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
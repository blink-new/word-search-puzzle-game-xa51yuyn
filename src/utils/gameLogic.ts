import { Word, Position, Direction, GameSettings } from '../types/game';
import { WORD_CATEGORIES, DIFFICULTY_SETTINGS } from '../data/words';

export function generateWordSearchGrid(difficulty: 'easy' | 'medium' | 'hard'): {
  grid: string[][];
  words: Word[];
} {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const { gridSize, wordCount, directions } = settings;
  
  // Initialize empty grid
  const grid: string[][] = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill('')
  );
  
  // Select random words from all categories
  const allWords = [
    ...WORD_CATEGORIES.food,
    ...WORD_CATEGORIES.animals,
    ...WORD_CATEGORIES.objects
  ];
  
  const selectedWords = getRandomWords(allWords, wordCount);
  const words: Word[] = [];
  
  // Place each word in the grid
  for (const wordText of selectedWords) {
    const word = placeWordInGrid(grid, wordText, directions);
    if (word) {
      words.push(word);
    }
  }
  
  // Fill empty cells with random letters
  fillEmptyCells(grid);
  
  return { grid, words };
}

function getRandomWords(wordList: string[], count: number): string[] {
  const shuffled = [...wordList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function placeWordInGrid(
  grid: string[][],
  wordText: string,
  allowedDirections: readonly Direction[]
): Word | null {
  const gridSize = grid.length;
  const maxAttempts = 100;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const direction = allowedDirections[Math.floor(Math.random() * allowedDirections.length)];
    const startPos = getRandomStartPosition(gridSize, wordText.length, direction);
    
    if (canPlaceWord(grid, wordText, startPos, direction)) {
      const positions = placeWord(grid, wordText, startPos, direction);
      return {
        text: wordText,
        category: getCategoryForWord(wordText),
        positions,
        found: false
      };
    }
  }
  
  return null;
}

function getRandomStartPosition(
  gridSize: number,
  wordLength: number,
  direction: Direction
): Position {
  let maxRow = gridSize - 1;
  let maxCol = gridSize - 1;
  
  switch (direction) {
    case 'horizontal':
      maxCol = gridSize - wordLength;
      break;
    case 'vertical':
      maxRow = gridSize - wordLength;
      break;
    case 'diagonal-down':
      maxRow = gridSize - wordLength;
      maxCol = gridSize - wordLength;
      break;
    case 'diagonal-up':
      maxRow = wordLength - 1;
      maxCol = gridSize - wordLength;
      break;
  }
  
  return {
    row: Math.floor(Math.random() * (maxRow + 1)),
    col: Math.floor(Math.random() * (maxCol + 1))
  };
}

function canPlaceWord(
  grid: string[][],
  word: string,
  startPos: Position,
  direction: Direction
): boolean {
  const positions = getWordPositions(startPos, word.length, direction);
  
  return positions.every(pos => {
    const cell = grid[pos.row][pos.col];
    return cell === '' || cell === word[positions.indexOf(pos)];
  });
}

function placeWord(
  grid: string[][],
  word: string,
  startPos: Position,
  direction: Direction
): Position[] {
  const positions = getWordPositions(startPos, word.length, direction);
  
  positions.forEach((pos, index) => {
    grid[pos.row][pos.col] = word[index];
  });
  
  return positions;
}

function getWordPositions(
  startPos: Position,
  length: number,
  direction: Direction
): Position[] {
  const positions: Position[] = [];
  
  for (let i = 0; i < length; i++) {
    let row = startPos.row;
    let col = startPos.col;
    
    switch (direction) {
      case 'horizontal':
        col += i;
        break;
      case 'vertical':
        row += i;
        break;
      case 'diagonal-down':
        row += i;
        col += i;
        break;
      case 'diagonal-up':
        row -= i;
        col += i;
        break;
    }
    
    positions.push({ row, col });
  }
  
  return positions;
}

function fillEmptyCells(grid: string[][]): void {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

function getCategoryForWord(word: string): string {
  if (WORD_CATEGORIES.food.includes(word)) return 'food';
  if (WORD_CATEGORIES.animals.includes(word)) return 'animals';
  if (WORD_CATEGORIES.objects.includes(word)) return 'objects';
  return 'unknown';
}

export function checkWordMatch(
  selectedPositions: Position[],
  words: Word[]
): Word | null {
  if (selectedPositions.length < 2) return null;
  
  for (const word of words) {
    if (word.found) continue;
    
    if (positionsMatch(selectedPositions, word.positions) ||
        positionsMatch(selectedPositions, [...word.positions].reverse())) {
      return word;
    }
  }
  
  return null;
}

function positionsMatch(pos1: Position[], pos2: Position[]): boolean {
  if (pos1.length !== pos2.length) return false;
  
  return pos1.every((p1, index) => {
    const p2 = pos2[index];
    return p1.row === p2.row && p1.col === p2.col;
  });
}

export function isPositionInWord(position: Position, word: Word): boolean {
  return word.positions.some(pos => 
    pos.row === position.row && pos.col === position.col
  );
}
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Position, Word } from '../types/game';
import { checkWordMatch, isPositionInWord } from '../utils/gameLogic';

interface WordSearchGridProps {
  grid: string[][];
  words: Word[];
  onWordFound: (word: Word) => void;
  foundWords: Set<string>;
}

export function WordSearchGrid({ grid, words, onWordFound, foundWords }: WordSearchGridProps) {
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback((row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  }, []);

  const handleMove = useCallback((row: number, col: number) => {
    if (!isSelecting) return;
    
    setSelectedCells(prev => {
      if (prev.length === 0) return [{ row, col }];
      
      const start = prev[0];
      const newSelection = getLinearSelection(start, { row, col });
      return newSelection;
    });
  }, [isSelecting]);

  const handleEnd = useCallback(() => {
    if (selectedCells.length > 1) {
      const matchedWord = checkWordMatch(selectedCells, words);
      if (matchedWord && !foundWords.has(matchedWord.text)) {
        // Add animation for found word
        const cellKeys = new Set(matchedWord.positions.map(pos => `${pos.row}-${pos.col}`));
        setAnimatingCells(cellKeys);
        
        // Remove animation after delay
        setTimeout(() => {
          setAnimatingCells(new Set());
        }, 600);
        
        onWordFound(matchedWord);
      }
    }
    
    setIsSelecting(false);
    setSelectedCells([]);
  }, [selectedCells, words, foundWords, onWordFound]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    handleStart(row, col);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset.row && element.dataset.col) {
      const row = parseInt(element.dataset.row);
      const col = parseInt(element.dataset.col);
      handleMove(row, col);
    }
  }, [handleMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleEnd();
  }, [handleEnd]);



  const getLinearSelection = (start: Position, end: Position): Position[] => {
    const positions: Position[] = [];
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    
    // Determine if selection is horizontal, vertical, or diagonal
    const isHorizontal = rowDiff === 0;
    const isVertical = colDiff === 0;
    const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff);
    
    if (!isHorizontal && !isVertical && !isDiagonal) {
      return [start]; // Invalid selection
    }
    
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    const rowStep = steps === 0 ? 0 : rowDiff / steps;
    const colStep = steps === 0 ? 0 : colDiff / steps;
    
    for (let i = 0; i <= steps; i++) {
      positions.push({
        row: start.row + Math.round(i * rowStep),
        col: start.col + Math.round(i * colStep)
      });
    }
    
    return positions;
  };

  const getCellClasses = (row: number, col: number): string => {
    const position = { row, col };
    const cellKey = `${row}-${col}`;
    const isSelected = selectedCells.some(cell => cell.row === row && cell.col === col);
    const isAnimating = animatingCells.has(cellKey);
    
    // Check if cell is part of a found word
    const foundWord = words.find(word => 
      word.found && isPositionInWord(position, word)
    );
    
    let classes = 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-slate-200 flex items-center justify-center text-sm sm:text-base md:text-lg font-semibold cursor-pointer select-none transition-all duration-300 hover:scale-105 hover:shadow-md rounded-lg';
    
    if (isAnimating) {
      classes += ' animate-pulse bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg scale-110';
    } else if (isSelected) {
      classes += ' bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg scale-105 border-primary';
    } else if (foundWord) {
      classes += ' bg-gradient-to-br from-accent to-accent/80 text-accent-foreground border-accent/50';
    } else {
      classes += ' bg-gradient-to-br from-white to-slate-50 text-slate-700 hover:from-slate-50 hover:to-slate-100';
    }
    
    return classes;
  };

  return (
    <div 
      ref={gridRef}
      className="inline-block p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border-2 border-slate-100"
      onMouseLeave={() => {
        if (isSelecting) {
          handleEnd();
        }
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClasses(rowIndex, colIndex)}
              data-row={rowIndex}
              data-col={colIndex}
              onMouseDown={() => handleStart(rowIndex, colIndex)}
              onMouseEnter={() => handleMove(rowIndex, colIndex)}
              onMouseUp={handleEnd}
              onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
            >
              {letter}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
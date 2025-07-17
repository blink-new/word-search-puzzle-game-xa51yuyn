import React, { useState, useEffect, useCallback } from 'react';
import { WordSearchGrid } from './components/WordSearchGrid';
import { WordList } from './components/WordList';
import { GameHeader } from './components/GameHeader';
import { GameCompletionModal } from './components/GameCompletionModal';
import { generateWordSearchGrid } from './utils/gameLogic';
import { Word } from './types/game';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';

function App() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { toast } = useToast();

  // Initialize new game
  const initializeGame = useCallback((newDifficulty: 'easy' | 'medium' | 'hard' = difficulty) => {
    const { grid: newGrid, words: newWords } = generateWordSearchGrid(newDifficulty);
    setGrid(newGrid);
    setWords(newWords);
    setFoundWords(new Set());
    setScore(0);
    setTimeElapsed(0);
    setIsGameComplete(false);
    setShowCompletionModal(false);
    setDifficulty(newDifficulty);
  }, [difficulty]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer effect
  useEffect(() => {
    if (isGameComplete) return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameComplete]);

  // Handle word found
  const handleWordFound = useCallback((word: Word) => {
    const newFoundWords = new Set(foundWords);
    newFoundWords.add(word.text);
    setFoundWords(newFoundWords);

    // Update word as found
    setWords(prev => prev.map(w => 
      w.text === word.text ? { ...w, found: true } : w
    ));

    // Calculate score based on word length and difficulty
    const baseScore = word.text.length * 10;
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
    const wordScore = Math.round(baseScore * difficultyMultiplier);
    setScore(prev => prev + wordScore);

    // Show toast notification
    toast({
      title: 'Word Found!',
      description: `${word.text} (+${wordScore} points)`,
      duration: 2000,
    });

    // Check if game is complete
    if (newFoundWords.size === words.length) {
      setIsGameComplete(true);
      setTimeout(() => setShowCompletionModal(true), 500);
    }
  }, [foundWords, words.length, difficulty, toast]);

  // Handle difficulty change
  const handleDifficultyChange = useCallback((newDifficulty: 'easy' | 'medium' | 'hard') => {
    initializeGame(newDifficulty);
  }, [initializeGame]);

  // Handle new game
  const handleNewGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Game Header */}
          <GameHeader
            score={score}
            timeElapsed={timeElapsed}
            difficulty={difficulty}
            foundWords={foundWords.size}
            totalWords={words.length}
            onNewGame={handleNewGame}
            onDifficultyChange={handleDifficultyChange}
          />

          {/* Main Game Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Word Search Grid */}
            <div className="lg:col-span-2 flex justify-center">
              {grid.length > 0 && (
                <WordSearchGrid
                  grid={grid}
                  words={words}
                  onWordFound={handleWordFound}
                  foundWords={foundWords}
                />
              )}
            </div>

            {/* Word List Sidebar */}
            <div className="lg:col-span-1">
              <WordList
                words={words}
                foundWords={foundWords}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Completion Modal */}
      <GameCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onNewGame={handleNewGame}
        score={score}
        timeElapsed={timeElapsed}
        difficulty={difficulty}
        wordsFound={foundWords.size}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default App;
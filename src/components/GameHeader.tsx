import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Clock, RotateCcw } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  timeElapsed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  foundWords: number;
  totalWords: number;
  onNewGame: () => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export function GameHeader({
  score,
  timeElapsed,
  difficulty,
  foundWords,
  totalWords,
  onNewGame,
  onDifficultyChange
}: GameHeaderProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string): string => {
    switch (diff) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border-2 border-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            🔍 Word Search Puzzle
          </h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={`${getDifficultyColor(difficulty)} font-semibold border-2`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-slate-700">
                {foundWords}/{totalWords} words found
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-yellow-100 px-3 py-2 rounded-xl border border-yellow-200">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-800">{score}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 rounded-xl border border-blue-200">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-mono font-bold text-blue-800">{formatTime(timeElapsed)}</span>
          </div>
          
          <Button
            onClick={onNewGame}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border-2 font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t-2 border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-700">Difficulty:</span>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <Button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                variant={difficulty === diff ? 'default' : 'outline'}
                size="sm"
                className={`text-xs font-semibold border-2 transition-all duration-200 ${
                  difficulty === diff 
                    ? 'bg-gradient-to-r from-primary to-primary/80 shadow-md' 
                    : 'bg-gradient-to-r from-white to-slate-50 hover:from-slate-50 hover:to-slate-100'
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Clock, Target, RotateCcw } from 'lucide-react';

interface GameCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  score: number;
  timeElapsed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  wordsFound: number;
}

export function GameCompletionModal({
  isOpen,
  onClose,
  onNewGame,
  score,
  timeElapsed,
  difficulty,
  wordsFound
}: GameCompletionModalProps) {
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

  const getPerformanceMessage = (): string => {
    if (timeElapsed < 120) return 'Lightning Fast! ⚡';
    if (timeElapsed < 300) return 'Great Job! 🎉';
    if (timeElapsed < 600) return 'Well Done! 👏';
    return 'Completed! 🎯';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Puzzle Complete!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-accent mb-2">
              {getPerformanceMessage()}
            </p>
            <p className="text-slate-600">
              You found all {wordsFound} words!
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="font-medium text-slate-700">Score</span>
              </div>
              <span className="font-bold text-lg text-slate-800">{score}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-medium text-slate-700">Time</span>
              </div>
              <span className="font-mono font-semibold text-slate-800">
                {formatTime(timeElapsed)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-500" />
                <span className="font-medium text-slate-700">Difficulty</span>
              </div>
              <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onNewGame}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
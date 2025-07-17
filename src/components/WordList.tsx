import React from 'react';
import { Word } from '../types/game';
import { Badge } from './ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface WordListProps {
  words: Word[];
  foundWords: Set<string>;
}

export function WordList({ words, foundWords }: WordListProps) {
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'food':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'animals':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'objects':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const groupedWords = words.reduce((acc, word) => {
    if (!acc[word.category]) {
      acc[word.category] = [];
    }
    acc[word.category].push(word);
    return acc;
  }, {} as Record<string, Word[]>);

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border-2 border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Words to Find
        </h2>
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          {foundWords.size}/{words.length}
        </div>
      </div>
      
      <div className="space-y-6">
        {Object.entries(groupedWords).map(([category, categoryWords]) => (
          <div key={category}>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getCategoryColor(category).replace('bg-', 'bg-').replace(' text-', ' ')}`}></div>
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {categoryWords.map((word) => (
                <div
                  key={word.text}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    foundWords.has(word.text)
                      ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800 shadow-md'
                      : 'bg-gradient-to-r from-slate-50 to-white border-slate-200 text-slate-700 hover:shadow-md'
                  }`}
                >
                  <span
                    className={`font-semibold text-sm ${
                      foundWords.has(word.text) ? 'line-through opacity-75' : ''
                    }`}
                  >
                    {word.text}
                  </span>
                  {foundWords.has(word.text) && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getCategoryColor('food')}>
            Food
          </Badge>
          <Badge variant="outline" className={getCategoryColor('animals')}>
            Animals
          </Badge>
          <Badge variant="outline" className={getCategoryColor('objects')}>
            Objects
          </Badge>
        </div>
      </div>
    </div>
  );
}
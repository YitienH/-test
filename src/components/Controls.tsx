import React from 'react';
import { Difficulty } from '../types';

interface ControlsProps {
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  onReset: () => void;
  status: 'idle' | 'playing' | 'won' | 'lost';
}

export const Controls: React.FC<ControlsProps> = ({ difficulty, setDifficulty, onReset, status }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-2xl p-4 bg-[#2c241b] border-2 border-[#8b5a2b] rounded-lg shadow-lg">
      <div className="flex gap-2">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
          <button
            key={diff}
            onClick={() => setDifficulty(diff)}
            className={`
              px-4 py-2 font-rye uppercase tracking-widest text-sm transition-all duration-200
              border-2 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-none
              ${difficulty === diff 
                ? 'bg-[#d4af37] text-[#2c241b] border-[#8b5a2b]' 
                : 'bg-[#4a3728] text-[#d4af37] border-[#d4af37] hover:bg-[#5c4a35]'
              }
            `}
          >
            {diff}
          </button>
        ))}
      </div>
      
      <button
        onClick={onReset}
        className="
          px-6 py-2 font-rye text-lg uppercase tracking-widest text-[#d4af37] bg-[#8b0000] 
          border-4 border-[#d4af37] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]
          hover:bg-[#a50000] active:scale-95 transition-all duration-200
        "
      >
        {status === 'lost' ? 'Retry' : status === 'won' ? 'Play Again' : 'Reset'}
      </button>
    </div>
  );
};

import React from 'react';
import { GameStatus } from '../types';

interface DisplayProps {
  minesLeft: number;
  timeElapsed: number;
  status: GameStatus;
}

export const Display: React.FC<DisplayProps> = ({ minesLeft, timeElapsed, status }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-2xl mb-4 p-4 bg-[#2c241b] border-4 border-[#8b5a2b] rounded-lg shadow-xl relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none" />

      {/* Mines Left */}
      <div className="flex flex-col items-center z-10">
        <span className="text-[#d4af37] font-rye text-xs uppercase tracking-widest mb-1">Mines</span>
        <div className="bg-black px-4 py-2 rounded border-2 border-[#5c3a1e] shadow-inner">
          <span className="font-mono text-3xl text-[#ff4500] drop-shadow-[0_0_5px_rgba(255,69,0,0.8)]">
            {minesLeft.toString().padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* Status Message */}
      <div className="flex flex-col items-center z-10">
        {status === 'won' && (
          <span className="text-[#32cd32] font-rye text-2xl uppercase tracking-widest animate-pulse drop-shadow-[0_0_10px_rgba(50,205,50,0.8)]">
            Victory!
          </span>
        )}
        {status === 'lost' && (
          <span className="text-[#ff0000] font-rye text-2xl uppercase tracking-widest animate-pulse drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
            Explosion!
          </span>
        )}
        {status === 'playing' && (
          <span className="text-[#d4af37] font-rye text-xl uppercase tracking-widest opacity-80">
            Active
          </span>
        )}
        {status === 'idle' && (
          <span className="text-[#d4af37] font-rye text-xl uppercase tracking-widest opacity-80">
            Ready
          </span>
        )}
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center z-10">
        <span className="text-[#d4af37] font-rye text-xs uppercase tracking-widest mb-1">Time</span>
        <div className="bg-black px-4 py-2 rounded border-2 border-[#5c3a1e] shadow-inner">
          <span className="font-mono text-3xl text-[#ff4500] drop-shadow-[0_0_5px_rgba(255,69,0,0.8)]">
            {timeElapsed.toString().padStart(3, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

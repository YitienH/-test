import React, { useCallback } from 'react';
import { useMinesweeper } from './hooks/useMinesweeper';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { Display } from './components/Display';

export default function App() {
  const {
    grid,
    status,
    minesLeft,
    timeElapsed,
    difficulty,
    setDifficulty,
    revealCell,
    flagCell,
    resetGame,
  } = useMinesweeper();

  const handleCellClick = useCallback((x: number, y: number) => {
    revealCell(x, y);
  }, [revealCell]);

  const handleCellRightClick = useCallback((e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    flagCell(x, y);
  }, [flagCell]);

  return (
    <div className="min-h-screen bg-[#1a1410] flex flex-col items-center justify-center p-4 font-sans text-[#d4af37] selection:bg-[#d4af37] selection:text-[#1a1410]">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
      
      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-4xl">
        
        {/* Header */}
        <header className="text-center mb-4">
          <h1 className="text-5xl md:text-7xl font-rye text-[#d4af37] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider">
            SteamSweeper
          </h1>
          <p className="text-[#8b5a2b] font-mono mt-2 tracking-widest uppercase text-sm">
            A Victorian Era Logic Puzzle
          </p>
        </header>

        {/* Game Controls & Display */}
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <Display 
            minesLeft={minesLeft} 
            timeElapsed={timeElapsed} 
            status={status} 
          />
          
          <Controls 
            difficulty={difficulty} 
            setDifficulty={setDifficulty} 
            onReset={resetGame} 
            status={status}
          />
        </div>

        {/* Game Board */}
        <div className="relative p-1 bg-[#2c241b] rounded-xl shadow-2xl border-4 border-[#5c3a1e] max-w-full overflow-x-auto">
          {/* Decorative Screws */}
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[#d4af37] shadow-lg border border-[#8b5a2b] z-20" />
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#d4af37] shadow-lg border border-[#8b5a2b] z-20" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-[#d4af37] shadow-lg border border-[#8b5a2b] z-20" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-[#d4af37] shadow-lg border border-[#8b5a2b] z-20" />

          <Board 
            grid={grid} 
            onCellClick={handleCellClick} 
            onCellRightClick={handleCellRightClick} 
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-[#5c3a1e] text-xs font-mono">
          EST. 1893 • AUTOMATED MINE DETECTION SYSTEM
        </footer>

      </div>
    </div>
  );
}

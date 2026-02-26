import React from 'react';
import { motion } from 'motion/react';
import { Flag, Bomb } from 'lucide-react';
import { CellState } from '../types';

interface CellProps {
  cell: CellState;
  onClick: (x: number, y: number) => void;
  onContextMenu: (e: React.MouseEvent, x: number, y: number) => void;
}

const NUMBER_COLORS = [
  '',
  'text-blue-700',
  'text-green-700',
  'text-red-700',
  'text-purple-800',
  'text-amber-900',
  'text-cyan-800',
  'text-black',
  'text-gray-600',
];

export const Cell: React.FC<CellProps> = React.memo(({ cell, onClick, onContextMenu }) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e, cell.x, cell.y);
  };

  return (
    <motion.div
      className={`
        w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer select-none font-mono font-bold text-lg
        ${cell.isRevealed 
          ? 'bg-[#e8dcc5] border border-[#bfa880] shadow-inner' 
          : 'bg-gradient-to-br from-[#c78d4d] to-[#8b5a2b] border-t-[#e6b57e] border-l-[#e6b57e] border-b-[#5c3a1e] border-r-[#5c3a1e] border-2 shadow-md active:border-t-[#5c3a1e] active:border-l-[#5c3a1e] active:border-b-[#e6b57e] active:border-r-[#e6b57e]'
        }
      `}
      onClick={() => onClick(cell.x, cell.y)}
      onContextMenu={handleContextMenu}
      initial={false}
      animate={{ scale: cell.isRevealed ? 1 : 1 }}
      whileHover={!cell.isRevealed ? { scale: 1.05 } : {}}
      whileTap={!cell.isRevealed ? { scale: 0.95 } : {}}
    >
      {cell.isRevealed ? (
        cell.isMine ? (
          <Bomb className="w-5 h-5 text-red-900" fill="currentColor" />
        ) : (
          cell.neighborMines > 0 && (
            <span className={NUMBER_COLORS[cell.neighborMines]}>
              {cell.neighborMines}
            </span>
          )
        )
      ) : (
        cell.isFlagged && <Flag className="w-5 h-5 text-red-800 drop-shadow-md" fill="currentColor" />
      )}
    </motion.div>
  );
});

import React from 'react';
import { CellState } from '../types';
import { Cell } from './Cell';

interface BoardProps {
  grid: CellState[][];
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (e: React.MouseEvent, x: number, y: number) => void;
}

export const Board: React.FC<BoardProps> = ({ grid, onCellClick, onCellRightClick }) => {
  if (!grid.length) return null;

  return (
    <div 
      className="grid gap-1 p-2 bg-[#4a3728] border-4 border-[#d4af37] rounded-lg shadow-2xl"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((row, y) => (
        row.map((cell, x) => (
          <Cell
            key={`${x}-${y}`}
            cell={cell}
            onClick={() => onCellClick(x, y)}
            onContextMenu={(e) => onCellRightClick(e, x, y)}
          />
        ))
      ))}
    </div>
  );
};

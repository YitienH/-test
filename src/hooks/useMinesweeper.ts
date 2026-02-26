import { useState, useEffect, useCallback, useRef } from 'react';
import { CellState, GameStatus, Difficulty, DIFFICULTIES } from '../types';

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function useMinesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [minesLeft, setMinesLeft] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const createEmptyGrid = useCallback((rows: number, cols: number) => {
    const newGrid: CellState[][] = [];
    for (let y = 0; y < rows; y++) {
      const row: CellState[] = [];
      for (let x = 0; x < cols; x++) {
        row.push({
          x,
          y,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newGrid.push(row);
    }
    return newGrid;
  }, []);

  const countNeighbors = (grid: CellState[][], x: number, y: number, rows: number, cols: number) => {
    let count = 0;
    DIRECTIONS.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[ny][nx].isMine) {
        count++;
      }
    });
    return count;
  };

  const placeMines = (grid: CellState[][], rows: number, cols: number, mines: number, firstClickX: number, firstClickY: number) => {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      // Ensure we don't place a mine on the first clicked cell or its neighbors
      if (!grid[y][x].isMine && (Math.abs(x - firstClickX) > 1 || Math.abs(y - firstClickY) > 1)) {
        grid[y][x].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calculate neighbors
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!grid[y][x].isMine) {
          grid[y][x].neighborMines = countNeighbors(grid, x, y, rows, cols);
        }
      }
    }
  };

  const resetGame = useCallback(() => {
    const { rows, cols, mines } = DIFFICULTIES[difficulty];
    setGrid(createEmptyGrid(rows, cols));
    setMinesLeft(mines);
    setStatus('idle');
    setTimeElapsed(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [difficulty, createEmptyGrid]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const revealCell = useCallback((x: number, y: number) => {
    if (status === 'won' || status === 'lost' || grid[y][x].isFlagged || grid[y][x].isRevealed) return;

    let newGrid = [...grid.map(row => [...row.map(cell => ({ ...cell }))])];
    const { rows, cols, mines } = DIFFICULTIES[difficulty];

    if (status === 'idle') {
      placeMines(newGrid, rows, cols, mines, x, y);
      setStatus('playing');
    }

    const stack = [[x, y]];
    
    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const cell = newGrid[cy][cx];

      if (cell.isRevealed || cell.isFlagged) continue;

      cell.isRevealed = true;

      if (cell.isMine) {
        setStatus('lost');
        // Reveal all mines
        newGrid.forEach(row => row.forEach(c => {
          if (c.isMine) c.isRevealed = true;
        }));
        setGrid(newGrid);
        return;
      }

      if (cell.neighborMines === 0) {
        DIRECTIONS.forEach(([dx, dy]) => {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if (!newGrid[ny][nx].isRevealed && !newGrid[ny][nx].isFlagged) {
              stack.push([nx, ny]);
            }
          }
        });
      }
    }

    // Check win
    let unrevealedSafeCells = 0;
    newGrid.forEach(row => row.forEach(c => {
      if (!c.isMine && !c.isRevealed) unrevealedSafeCells++;
    }));

    if (unrevealedSafeCells === 0) {
      setStatus('won');
      newGrid.forEach(row => row.forEach(c => {
        if (c.isMine) c.isFlagged = true;
      }));
      setMinesLeft(0);
    }

    setGrid(newGrid);
  }, [grid, status, difficulty]);

  const flagCell = useCallback((x: number, y: number) => {
    if (status === 'won' || status === 'lost') return;
    
    const newGrid = [...grid.map(row => [...row.map(cell => ({ ...cell }))])];
    const cell = newGrid[y][x];

    if (cell.isRevealed) return;

    if (status === 'idle') {
        // Can't flag before starting? Or just start game?
        // Standard minesweeper allows flagging before start, but timer doesn't start.
        // Let's just allow it but not change status to playing yet.
    }

    cell.isFlagged = !cell.isFlagged;
    setMinesLeft((prev) => prev + (cell.isFlagged ? -1 : 1));
    setGrid(newGrid);
  }, [grid, status]);

  return {
    grid,
    status,
    minesLeft,
    timeElapsed,
    difficulty,
    setDifficulty,
    revealCell,
    flagCell,
    resetGame,
  };
}

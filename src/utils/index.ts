import { GameCell, TBoard } from "../types";
import { DIRECTIONS } from "../constants";

/**
 * Reveals an empty 2D array of cells with the specified number of rows and columns.
 * Each cell is initialized with null value, isFlagged set to false, and isOpened set to false.
 */

const createBoard = (rows: number, cols: number) => {
  const board: TBoard = [];

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    board[rowIndex] = [];

    for (let cellIndex = 0; cellIndex < cols; cellIndex++) {
      board[rowIndex][cellIndex] = {
        value: null,
        isFlagged: false,
        isOpened: false,
      };
    }
  }

  return board;
};

/**
 * Randomly places the specified number of mines on the board.
 * Uses a while loop to ensure that the number of mines is less than the total number of mines
 * and ensure exactly totalMines mines are placed on the board.
 * Avoids placing mines on the same cell.
 */

const fillBoardWithMines = (
  board: TBoard,
  rows: number,
  cols: number,
  totalMines: number
) => {
  let mines = 0;

  while (mines < totalMines) {
    const row = Math.floor(Math.random() * rows);
    const column = Math.floor(Math.random() * cols);

    if (board[row][column].value !== "mine") {
      (board[row][column] as GameCell).value = "mine";
      mines++;
    }
  }
  return board;
};

/**
 * Calculates the number of adjacent mines for each cell.
 * Uses the DIRECTIONS constant to check all 8 surrounding cells.
 * Assigns a number value to each non-mine cell based on adjacent mines
 */
const fillBoardWithNumbers = (board: TBoard) => {
  // const finalBoard: TBoard = JSON.parse(JSON.stringify(boardWithMines));

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.value !== "mine") {
        let minesAround = 0;

        DIRECTIONS.forEach(([dRow, dCol]) => {
          const newRow = rowIndex + dRow;
          const newCol = colIndex + dCol;

          if (newRow in board && newCol in board[newRow]) {
            if (board[newRow][newCol].value === "mine") {
              minesAround++;
            }
          }
        });

        cell.value = minesAround;
      }
    });
  });

  return board;
};

/**
 * Main board initialization function, combining all steps
 * 1. Create an empty board
 * 2. Place mines
 * 3. Calculate numbers for each cell
 */
export const initBoard = (rows: number, cols: number, totalMines: number) => {
  const emptyBoard = createBoard(rows, cols);
  const boardWithMines = fillBoardWithMines(emptyBoard, rows, cols, totalMines);
  const gameBoard = fillBoardWithNumbers(boardWithMines);

  return gameBoard;
};

export const initGame = (rows: number, cols: number, totalMines: number) => {
  return initBoard(rows, cols, totalMines);
};

/**
 * Reveal all connected empty cells when player clicks on an empty cell
 * Uses a queue-based flood fill algorithm to reveal all connected empty cells (BFS)
 * BFS because it's more efficient than recursive DFS for large grids
 */

export const revealEmptyCells = (
  board: TBoard,
  rows: number,
  cols: number,
  row: number,
  col: number
) => {
  const queue: [number, number][] = [[row, col]]; // Queue of cell coordinates to check 

  while (queue.length > 0) {
    const [currentRow, currentCol] = queue.shift()!; // Loop until the queue is empty (FIFO)

    const cell = board[currentRow][currentCol];
    cell.isOpened = true; // Open the cell and mark as revealed 

    if (cell.value === 0) { // If cell is empty, explore all adjacent cells
      for (const [dRow, dCol] of DIRECTIONS) { // Check all 8 directions 
        const newRow = currentRow + dRow;
        const newCol = currentCol + dCol;

        if ( // Add valid, unopened, and unflagged adjacent cells to queue
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          !board[newRow][newCol].isOpened &&
          !board[newRow][newCol].isFlagged
        ) {
          queue.push([newRow, newCol]); // Push the adjacent cell to the queue
        }
      }
    }
  }

  return board;
};

/**
 * Reveal all mines at the end of the game
 * Used when player loses (hits a mine) or wins
 * If highlightWin is true, the mines will be highlighted in green
 */

export const revealAllMines = (board: TBoard, highlightWin?: boolean) => {
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.value === "mine") {
        cell.isOpened = true;
        if (highlightWin) {
          cell.highlight = "green";
        }
      }
    });
  });
};

/**
 * Check if the game is won
 * Win conditions:
 * 1. Number of unopened cells is equal to the number of mines
 * 2. All mines are flagged
 */

export const checkGameWin = (board: TBoard, totalMines: number) => {
  let unopenedCells = 0;
  let correctlyFlaggedMines = 0;

  board.forEach((row) => {
    row.forEach((cell) => {
      if (!cell.isOpened) {
        unopenedCells++;
      }

      if (cell.isFlagged && cell.value === "mine") {
        correctlyFlaggedMines++;
      }
    });
  });

  // Win condition: All non-mine cells are opened, or all mines are flagged.
  return unopenedCells === totalMines || correctlyFlaggedMines === totalMines;
};

export const getTimeDiff = (timeNow: Date | null, timeStarted: Date | null) => {
  if (timeNow === null || timeStarted === null) return "00:00";

  return new Intl.DateTimeFormat("en-US", {
    minute: "2-digit",
    second: "numeric",
  }).format(timeNow.getTime() - timeStarted.getTime());
  // return Math.floor((timeNow.getTime() - startTime.getTime()) / 1000);
};
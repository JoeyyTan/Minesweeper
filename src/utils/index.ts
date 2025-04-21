import { TBoard } from "../types";
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
 * Main board initialization function (with first-click safety).
 * 
 * Steps:
 * 1. Create an empty board (no mines yet).
 * 2. Build a list of valid cells to place mines.
 *    - If safeCell is provided (first click), exclude that cell.
 * 3. Randomly shuffle valid positions.
 * 4. Place mines in the first N cells after shuffling.
 * 5. Calculate numbers for all non-mine cells based on adjacent mines.
 */

// Fisher–Yates shuffle algorithm
function shuffle<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) { // Loop backwards
    const j = Math.floor(Math.random() * (i + 1)); // Pick a random index j between 0 and i 
    [array[i], array[j]] = [array[j], array[i]]; // Swap array 
  }
}

export const initBoard = (
  rows: number,
  cols: number,
  totalMines: number,
  safeCell?: { row: number; col: number }
): TBoard => {
  const board = createBoard(rows, cols);

  // Filter out safe cells (possible cell), if safeCell provided it excludes cell from list 
  const availableCells: { row: number; col: number }[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isSafe =
        !safeCell || (row !== safeCell.row || col !== safeCell.col);

      if (isSafe) {
        availableCells.push({ row, col });
      }
    }
  }

  // Randomly reorders the list of safe positions, 
  shuffle(availableCells); // Randomize locations 
  const mineCells = availableCells.slice(0, totalMines); // First N random pos to place mine 

  for (const { row, col } of mineCells) {
    board[row][col].value = "mine"; // Fill board with mines 
  }

  // Step 3: Fill numbers
  return fillBoardWithNumbers(board); // Calculate numbers around mines 
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
};
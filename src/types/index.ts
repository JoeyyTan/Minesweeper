import { LEVELS } from "../constants";

// Game cell state types
type OpenedCell = {
  isOpened: true; // Cell has been clicked and opened
  isFlagged: false; // Opened cells can't be flagged 
};

type ClosedCell = {
  isOpened: false; // Cell has not been clicked and opened
  isFlagged: boolean; // Cell can be flagged or unflagged
};

// Cell content types
type MineCell = {
  value: "mine"; // Cell contains a mine
  highlight?: "red" | "green"; // Cell can be highlighted in red or green
};

type NumberCell = {
  value: number; // Number of adjacent mines (0-8)
};

// Combined cell types using intersection types
export type OpenedMineCell = OpenedCell & MineCell; // Opened cell with a mine
type ClosedMineCell = ClosedCell & MineCell; // Closed cell with a mine
export type OpenedNumberCell = OpenedCell & NumberCell; // Opened cell with a number
type ClosedNumberCell = ClosedCell & NumberCell; // Closed cell with a number

// Empty cell type
type EmptyCell = {
  value: null; // Cell has no value
  isFlagged: false; // Empty cells can't be flagged
  isOpened: false; // Empty cells can't be opened
};

// Game cell type
// Union type of all possible cell types
export type GameCell =
  | OpenedMineCell
  | ClosedMineCell
  | OpenedNumberCell
  | ClosedNumberCell
  | EmptyCell;

// Game board is a 2D array of GameCell
export type TBoard = GameCell[][];

// Game level type
// Union type of all predefined levels or custom level
export type TLevel = keyof typeof LEVELS | "custom";

// Custom Game Settings
export type CustomGameSettings = {
  rows: number;
  cols: number;
  totalMines: number;
};

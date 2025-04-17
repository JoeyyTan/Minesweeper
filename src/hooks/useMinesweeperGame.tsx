import { MouseEvent, useCallback, useEffect, useState } from "react";
import useTimer from "./useTimer.tsx";
import { DEFAULT_LEVEL, LEVELS } from "../constants";
import {
  checkGameWin,
  initBoard,
  initGame,
  revealAllMines,
  revealEmptyCells,
} from "../utils";

import type { TBoard, TLevel, CustomGameSettings } from "../types";

// Main game hook that manages game state and logic
const useMinesweeperGame = () => {
  // State for game difficulty level and custom settings
  const [level, setLevel] = useState<TLevel>("easy");
  const [customSettings, setCustomSettings] = useState<CustomGameSettings>(LEVELS.custom);
  const currentLevel = level === "custom" ? customSettings : LEVELS[level as keyof typeof LEVELS];

  // Callbacks for changing level and custom settings 
  const changeLevel = useCallback((selectedLevel: TLevel) => {
    setLevel(selectedLevel);
  }, []);

  const setCustomGameSettings = useCallback((settings: CustomGameSettings) => {
    setCustomSettings(settings);
    setLevel("custom");
  }, []);

  // Initialize game board with default level
  const [gameBoard, setGameBoard] = useState<TBoard>(
    initGame(
      LEVELS[DEFAULT_LEVEL].rows,
      LEVELS[DEFAULT_LEVEL].cols,
      LEVELS[DEFAULT_LEVEL].totalMines
    )
  );

  // Game state flags
  const [isGameWin, setIsGameWin] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const isGameEnded = isGameWin || isGameOver;

  // Flags and mines left
  const [totalFlags, setTotalFlags] = useState(0);
  const minesLeft = currentLevel.totalMines - totalFlags;

  // Timer functionality from useTimer hook
  const { timeDiff, isTimerRunning, startTimer, stopTimer, resetTimer } =
    useTimer();

  // Board reset logic for new game or restart 
  const resetBoard = useCallback(
    (isRestart?: boolean) => {
      stopTimer();
      resetTimer();
      setTotalFlags(0);
      setIsGameOver(false);
      setIsGameWin(false);

      if (isRestart) {
        setGameBoard((prevGameBoard) =>
          prevGameBoard.map((row) =>
            row.map((cell) => {
              return {
                value: cell.value,
                isFlagged: false,
                isOpened: false,
              };
            })
          )
        );
      } else {
        setGameBoard(
          initGame(
            currentLevel.rows,
            currentLevel.cols,
            currentLevel.totalMines
          )
        );
      }
    },
    [currentLevel, resetTimer, stopTimer]
  );

  // Helper functions for starting and restarting the game
  const startNewGame = useCallback(() => {
    resetBoard();
  }, [resetBoard]);

  // const restartGame = useCallback(() => {
  //   resetBoard(true);
  // }, [resetBoard]);

  // Stop timer when game ends
  useEffect(() => {
    if (isGameEnded) {
      stopTimer();
    }
  }, [isGameEnded, stopTimer]);

  // Start new game when level changes
  useEffect(() => {
    startNewGame();
  }, [level, startNewGame]);

  // Open cell logic
  const openCell = useCallback(
    (board: TBoard, row: number, col: number): TBoard | null => {
      // Start timer on first click
      if (!isTimerRunning) startTimer();

      // Create a deep copy (detect state change)of the board to avoid mutating the original board
      const newGameBoard: TBoard = JSON.parse(JSON.stringify(board));
      const cell = newGameBoard[row][col];
      const isMineCell = cell.value === "mine";
      const isNumberCell = typeof cell.value === "number" && cell.value > 0;

      if (isMineCell) {
        // Player clicked on a mine aka game over
        cell.highlight = "red";
        setIsGameOver(true);
        revealAllMines(newGameBoard);
      }

      if (!isMineCell) {
        // Open the cell
        cell.isOpened = true;
        if (cell.value === 0) {
          // If the cell is empty, reveal all connected empty cells
          revealEmptyCells(
            newGameBoard,
            currentLevel.rows,
            currentLevel.cols,
            row,
            col
          );
        }

        if (isNumberCell) {
          // If the cell is a number, reveal the cell
          cell.isOpened = true;
        }

        if (checkGameWin(newGameBoard, currentLevel.totalMines)) {
          // If the game is won, reveal all mines
          revealAllMines(newGameBoard, true);
          setIsGameWin(true);
        }
      }

      return newGameBoard;
    },
    [currentLevel, isTimerRunning, startTimer]
  );

  // Handle left click on a cell
  const handleCellLeftClick = useCallback(
    (row: number, col: number) => {
      // If game is over, return null
      if (
        isGameEnded ||
        gameBoard[row][col].isOpened ||
        gameBoard[row][col].isFlagged
      ) {
        return null;
      }

      const mineCell = gameBoard[row][col].value === "mine";
      const isFirstClick = !isTimerRunning; // If timer is not running => first click
      const isFirstClickOnMine = mineCell && isFirstClick;

      let newGameBoard: TBoard;

      if (isFirstClickOnMine) {
        // If the first click is on a mine, initialize a new board (first-click safety)
        do {
          newGameBoard = initBoard(
            currentLevel.rows,
            currentLevel.cols,
            currentLevel.totalMines
          );
        } while (newGameBoard[row][col].value === "mine");
      } else {
        newGameBoard = JSON.parse(JSON.stringify(gameBoard));
      }

      const boardAfterOpeningCell = openCell(newGameBoard, row, col);

      if (boardAfterOpeningCell) {
        setGameBoard(boardAfterOpeningCell);
      }
    },
    [isGameEnded, gameBoard, isTimerRunning, openCell, currentLevel]
  );

  // Handle right click on a cell
  const handleCellRightClick = useCallback(
    (e: MouseEvent<HTMLDivElement>, row: number, col: number) => {
      e.preventDefault();

      // If game is over or cell is already opened, return
      if (isGameEnded || gameBoard[row][col].isOpened) return;

      // Start timer on first click
      if (!isTimerRunning) startTimer();

      let flagsDiff = 0;

      setGameBoard((prevGameBoard) => {
        const newGameBoard: TBoard = JSON.parse(JSON.stringify(prevGameBoard));
        const cell = prevGameBoard[row][col];

        if (cell.isFlagged) {
          // If cell is flagged, unflag it
          newGameBoard[row][col].isFlagged = false;
          if (!flagsDiff) flagsDiff--;
        }

        if (!cell.isFlagged) {
          // If cell is not flagged, flag it
          newGameBoard[row][col].isFlagged = true;
          if (!flagsDiff) flagsDiff++;
        }

        // Check if winning by flagging all mines
        if (checkGameWin(newGameBoard, currentLevel.totalMines)) {
          revealAllMines(newGameBoard, true);
          setIsGameWin(true);
        }

        return newGameBoard;
      });

      // Update total flags
      setTotalFlags((prevTotalFlags) => prevTotalFlags + flagsDiff);
    },
    [
      gameBoard,
      isGameEnded,
      isTimerRunning,
      currentLevel.totalMines,
      startTimer,
    ]
  );

  return {
    level,
    changeLevel,
    customSettings,
    setCustomGameSettings,
    gameBoard,
    minesLeft,
    timeDiff,
    startNewGame,
    // restartGame,
    handleCellLeftClick,
    handleCellRightClick,
    isGameWin,
    isGameOver,
    isGameEnded,
  };
};

export default useMinesweeperGame;

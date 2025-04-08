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

const useMinesweeperGame = () => {
  const [level, setLevel] = useState<TLevel>("easy");
  const [customSettings, setCustomSettings] = useState<CustomGameSettings>(LEVELS.custom);
  const currentLevel = level === "custom" ? customSettings : LEVELS[level as keyof typeof LEVELS];

  const changeLevel = useCallback((selectedLevel: TLevel) => {
    setLevel(selectedLevel);
  }, []);

  const setCustomGameSettings = useCallback((settings: CustomGameSettings) => {
    setCustomSettings(settings);
    setLevel("custom");
  }, []);

  const [gameBoard, setGameBoard] = useState<TBoard>(
    initGame(
      LEVELS[DEFAULT_LEVEL].rows,
      LEVELS[DEFAULT_LEVEL].cols,
      LEVELS[DEFAULT_LEVEL].totalMines
    )
  );

  const [isGameWin, setIsGameWin] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const isGameEnded = isGameWin || isGameOver;

  const [totalFlags, setTotalFlags] = useState(0);
  const minesLeft = currentLevel.totalMines - totalFlags;

  const { timeDiff, isTimerRunning, startTimer, stopTimer, resetTimer } =
    useTimer();

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

  const startNewGame = useCallback(() => {
    resetBoard();
  }, [resetBoard]);

  const restartGame = useCallback(() => {
    resetBoard(true);
  }, [resetBoard]);

  useEffect(() => {
    if (isGameEnded) {
      stopTimer();
    }
  }, [isGameEnded, stopTimer]);

  useEffect(() => {
    startNewGame();
  }, [level, startNewGame]);

  const openCell = useCallback(
    (board: TBoard, row: number, col: number): TBoard | null => {
      if (!isTimerRunning) startTimer();

      const newGameBoard: TBoard = JSON.parse(JSON.stringify(board));
      const cell = newGameBoard[row][col];
      const isMineCell = cell.value === "mine";
      const isNumberCell = typeof cell.value === "number" && cell.value > 0;

      if (isMineCell) {
        cell.highlight = "red";
        setIsGameOver(true);
        revealAllMines(newGameBoard);
      }

      if (!isMineCell) {
        cell.isOpened = true;
        if (cell.value === 0) {
          revealEmptyCells(
            newGameBoard,
            currentLevel.rows,
            currentLevel.cols,
            row,
            col
          );
        }

        if (isNumberCell) {
        }

        if (checkGameWin(newGameBoard, currentLevel.totalMines)) {
          revealAllMines(newGameBoard, true);
          setIsGameWin(true);
        }
      }

      return newGameBoard;
    },
    [currentLevel, isTimerRunning, startTimer]
  );

  const handleCellLeftClick = useCallback(
    (row: number, col: number) => {
      if (
        isGameEnded ||
        gameBoard[row][col].isOpened ||
        gameBoard[row][col].isFlagged
      ) {
        return null;
      }

      const mineCell = gameBoard[row][col].value === "mine";
      const isFirstClick = !isTimerRunning;
      const isFirstClickOnMine = mineCell && isFirstClick;

      let newGameBoard: TBoard;

      if (isFirstClickOnMine) {
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

  const handleCellRightClick = useCallback(
    (e: MouseEvent<HTMLDivElement>, row: number, col: number) => {
      e.preventDefault();

      if (isGameEnded || gameBoard[row][col].isOpened) return;

      if (!isTimerRunning) startTimer();

      let flagsDiff = 0;

      setGameBoard((prevGameBoard) => {
        const newGameBoard: TBoard = JSON.parse(JSON.stringify(prevGameBoard));
        const cell = prevGameBoard[row][col];

        if (cell.isFlagged) {
          newGameBoard[row][col].isFlagged = false;
          if (!flagsDiff) flagsDiff--;
        }

        if (!cell.isFlagged) {
          newGameBoard[row][col].isFlagged = true;
          if (!flagsDiff) flagsDiff++;
        }

        if (checkGameWin(newGameBoard, currentLevel.totalMines)) {
          revealAllMines(newGameBoard, true);
          setIsGameWin(true);
        }

        return newGameBoard;
      });

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
    restartGame,
    handleCellLeftClick,
    handleCellRightClick,
    isGameWin,
    isGameOver,
    isGameEnded,
  };
};

export default useMinesweeperGame;

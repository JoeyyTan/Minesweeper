import { DIRECTIONS } from "../constants";
import { TBoard, GameCell } from "../types"

const createBoard = (rows: number, cols: number) => {
	const board: TBoard = [];

	for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
		board[rowIndex] = []

		for (let cellIndex = 0; cellIndex < cols; cellIndex++) {
			board[rowIndex][cellIndex] = {
				value: null,
				isFlagged: false,
				isOpened: false
			}
		}
	}
	return board;
};

const fillBoardWithMines = (emptyBoard: TBoard, rows: number, cols: number, totalMines: number) => {
	let mines = 0;

	while (mines < totalMines) {
		const row = Math.floor(Math.random() * rows);
		const col = Math.floor(Math.random() * cols);

		if (emptyBoard[row][col].value !== "mine") {
			(emptyBoard[row][col] as GameCell).value = "mine";
			mines++;
		}
	}

	return emptyBoard;
};

const fillBoardWithNumbers = (board: TBoard) => {
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


export const initBoard = (rows: number, cols: number, totalMines: number) => {
	const emptyBoard = createBoard(rows, cols);
	const boardWithMines = fillBoardWithMines(emptyBoard, rows, cols, totalMines);
	const gameBoard = fillBoardWithNumbers(boardWithMines);

	return gameBoard;
};

export const initGame = (rows: number, cols: number, totalMines: number) => {
  return initBoard(rows, cols, totalMines);
};
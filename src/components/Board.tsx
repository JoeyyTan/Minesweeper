import Cell from "./Cell";
import { TBoard } from "../types";
import { initGame } from "../utils";

const BOARD: TBoard = initGame(9, 9, 10);

const Board = () => {
  return (
    <div className="board">
      {BOARD.map((row) => (
				<div className="row">
					{row.map((cell) => (
						<Cell cell={cell} />
					))}
				</div>
    	))}
    </div>
  )
}

export default Board;
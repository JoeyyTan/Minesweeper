type OpenedCell = {
  isOpened: true;
  isFlagged: false;
}
type ClosedCell = {
  isOpened: false;
  isFlagged: boolean;
}
type MineCell = {
  value: "mine";
  highlight?: "red" | "green";
}
type NumberCell = {
  value: number; 
} 
type EmptyCell = {
	value: null;
	isFlagged: false;
	isOpened: false;
} 
export type OpenedMinedCell = OpenedCell & MineCell;
type ClosedMinedCell = ClosedCell & MineCell;
export type OpenedNumberCell = OpenedCell & NumberCell;
type ClosedNumberCell = ClosedCell & NumberCell;

export type GameCell = 
  | OpenedMinedCell 
  | ClosedMinedCell 
  | OpenedNumberCell 
  | ClosedNumberCell 
  | EmptyCell;

	export type TBoard = GameCell[][]

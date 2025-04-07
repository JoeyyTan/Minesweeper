import clsx from "clsx";
import { CELL_NUMBERS_COLORS } from "../constants";
import mineIcon from "/icons/bomb.svg";
import flagIcon from "/icons/red-flag.png";

const Cell = ({ cell }) => {
  return (
		<div
			className={clsx(
				"cell",
				typeof cell.value === "number" && CELL_NUMBERS_COLORS[cell.value]
			)}
		>
			{typeof cell.value === "number" && cell.value || ""}
			{cell.value === "mine" && <img src={mineIcon} />}
			{!cell.isOpened && (
				<div className="overlay">
					<img 
						src={flagIcon}
						className={clsx("flag", cell.isFlagged && "visible")}
					/>
				</div>
			)}
		</div>
	)
}

export default Cell;
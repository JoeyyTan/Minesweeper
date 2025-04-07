import clsx from "clsx";
import { LEVELS } from "../constants";
import { memo } from "react";
import { TLevel } from "../types";

type SelectedLevelProps = {
  level: TLevel;
  changeLevel: (selectedLevelName: TLevel) => void;
};

const SelectLevel = memo(({ level, changeLevel }: SelectedLevelProps) => {
  const standardLevels = Object.keys(LEVELS).filter(levelName => levelName !== "custom");
  
  return (
    <ul className="select-level">
      {standardLevels.map((levelName) => (
        <li key={levelName}>
          <button
            className={clsx(level === levelName && "active")}
            onClick={() => changeLevel(levelName as TLevel)}
          >
            {levelName}
          </button>
        </li>
      ))}
      <li>
        <button
          className={clsx(level === "custom" && "active")}
          onClick={() => changeLevel("custom")}
        >
          custom
        </button>
      </li>
    </ul>
  );
});

export default SelectLevel;

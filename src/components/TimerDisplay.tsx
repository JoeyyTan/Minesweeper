import { memo } from "react";
import TimerIcon from "/icons/timer.svg";

type TimerDisplayProps = {
  timeDiff: string;
};

const TimerDisplay = ({ timeDiff }: TimerDisplayProps) => {
  return (
    <>
      <img src={TimerIcon} className="header-icon" />
      {timeDiff}
    </>
  );
};

export default memo(TimerDisplay);

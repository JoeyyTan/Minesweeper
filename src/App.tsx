// UI
import Header from "./components/Header";
import Board from "./components/Board";
import SelectLevel from "./components/SelectLevel";
import Confetti from "./components/Confetti.tsx";
import CustomGameForm from "./components/CustomGameForm";

// Game logic
import useMinesweeperGame from "./hooks/useMinesweeperGame";

// Styles
import "./App.css";

function App() {
  const {
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
  } = useMinesweeperGame();

  return (
    <div className="game">
      <Header
        isGameWin={isGameWin}
        isGameOver={isGameOver}
        isGameEnded={isGameEnded}
        minesLeft={minesLeft}
        startNewGame={startNewGame}
        restartGame={restartGame}
        timeDiff={timeDiff}
      />
      <Board
        gameBoard={gameBoard}
        handleCellLeftClick={handleCellLeftClick}
        handleCellRightClick={handleCellRightClick}
        level={level}
      />
      <SelectLevel level={level} changeLevel={changeLevel} />
      <CustomGameForm 
        isVisible={level === "custom"} 
        defaultSettings={customSettings}
        onSubmit={setCustomGameSettings}
      />
      {isGameWin && <Confetti />}
    </div>
  );
}

export default App;

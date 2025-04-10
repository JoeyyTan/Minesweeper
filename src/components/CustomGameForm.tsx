import { useState } from "react";
import { CustomGameSettings } from "../types";

type CustomGameFormProps = {
  onSubmit: (settings: CustomGameSettings) => void;
  defaultSettings: CustomGameSettings;
  isVisible: boolean;
};

const CustomGameForm = ({ onSubmit, defaultSettings, isVisible }: CustomGameFormProps) => {
  const [settings, setSettings] = useState<CustomGameSettings>(defaultSettings);
  const [error, setError] = useState<string | null>(null);

  if (!isVisible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    if (isNaN(numValue) || numValue < 1) {
      return;
    }
    
    setSettings(prev => ({ ...prev, [name]: numValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate settings
    const maxCells = 480; // Limit total cells to avoid performance issues
    const totalCells = settings.rows * settings.cols;
    
    if (totalCells > maxCells) {
      setError(`Board size too large. Maximum cells allowed: ${maxCells}`);
      return;
    }
    
    if (settings.totalMines >= totalCells) {
      setError("Too many mines. Must be less than total cells.");
      return;
    }
    
    if (settings.totalMines < 1) {
      setError("Must have at least 1 mine.");
      return;
    }
    
    setError(null);
    onSubmit(settings);
  };

  return (
    <div className="custom-game-form">
      <h3>Design Your Minesweeper</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rows">Rows:</label>
          <input
            type="number"
            id="rows"
            name="rows"
            min="1"
            max="30"
            value={settings.rows}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cols">Columns:</label>
          <input
            type="number"
            id="cols"
            name="cols"
            min="1"
            max="30"
            value={settings.cols}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="totalMines">Mines:</label>
          <input
            type="number"
            id="totalMines"
            name="totalMines"
            min="1"
            max={settings.rows * settings.cols - 1}
            value={settings.totalMines}
            onChange={handleChange}
          />
        </div>

        {error && <div className="error">{error}</div>}
        <button type="submit" className="start-button">Start Game</button>
      </form>
    </div>
  );
};

export default CustomGameForm; 
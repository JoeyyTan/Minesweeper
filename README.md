# Minesweeper Game

## Project Overview
This is a customizable Minesweeper game built with React. It includes classic Minesweeper gameplay with additional features for custom board generation.

## Features
- Three difficulty levels: Easy, Medium, Expert
- Custom game mode with adjustable board size and mine count
- Responsive design for various screen sizes

## Dependencies
All required dependencies are already included in the `package.json` file. The project uses the following main dependencies:

- **React**: A JavaScript library for building user interfaces
- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript
- **clsx**: A utility for constructing `className` strings conditionally
- **react-confetti**: For the celebration effect when winning

You don't need to install any dependencies individually. Simply run:
```bash
npm install
```

This will automatically install all the required dependencies listed in the package.json file.

## Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   All required dependencies are already included in the package.json file (see [Dependencies](#dependencies) section).

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173/`.

## Usage
- Select a difficulty level or create a custom game.
- Click on cells to reveal them.
- Right-click to place flags on suspected mines.
- The game ends when all non-mine cells are revealed or a mine is clicked.

## Customization
- Modify the `src/constants/index.ts` file to adjust default levels and settings.
- Update styles in `src/App.css` to change the theme and appearance.

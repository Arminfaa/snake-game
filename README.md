# 🐍 Snake Game

A modern, responsive Snake game built with **React** and **TypeScript**. Play in the browser on desktop or mobile — wrap through walls, dodge your own tail, and chase emoji food to beat your high score.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

## ✨ Features

- **Classic gameplay** — grow the snake by eating food; game over on self-collision
- **Wrap-around walls** — exit one edge and re-enter from the opposite side
- **Adjustable speed** — 10 difficulty levels (saved in `localStorage`)
- **High score tracking** — your best score persists between sessions
- **Random emoji food** — 🍎 🍇 🍒 🍕 🍔 and more
- **Desktop controls** — arrow keys or WASD; pause with Space or Esc
- **Mobile-friendly UI**
  - Responsive board that scales to screen width
  - On-screen D-pad for touch input
  - Swipe gestures on the game board
  - Safe-area support for notched devices
- **Polished UI** — dark theme, glassmorphism panels, smooth animations

## 🎮 How to Play

1. Choose a direction to start moving.
2. Eat food to grow and earn **10 points** per item.
3. Avoid running into yourself.
4. Use the walls to your advantage — the snake wraps around the grid.
5. Adjust speed with the slider and try to beat your **Best** score.

## 🕹️ Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move | `↑` `↓` `←` `→` or `W` `A` `S` `D` | D-pad or swipe on the board |
| Pause / Resume | `Space` or `Esc` | Pause button |
| Play again | — | Shown after game over |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/Arminfaa/snake-game.git
cd snake-game
npm install
```

### Development

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Production Build

```bash
npm run build
```

Output is written to the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
snake-game/
├── public/                 # Static assets (favicon, icons)
├── src/
│   ├── components/
│   │   └── SnakeGame.tsx   # UI: board, HUD, controls, D-pad
│   ├── hooks/
│   │   ├── useSnakeGame.ts           # Game logic & state
│   │   └── useResponsiveCellSize.ts  # Mobile board scaling
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts            # Point, Direction types
│   ├── utils.ts            # Grid config, food, scores, speed
│   └── index.css           # Global & responsive styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 19 |
| Language | TypeScript |
| Build tool | Vite 8 |
| Styling | Plain CSS (no framework) |
| Persistence | `localStorage` (high score & speed level) |

## ⚙️ Configuration

Game constants live in `src/utils.ts`:

| Constant | Default | Description |
|----------|---------|-------------|
| `GRID_SIZE` | `24` | Board dimensions (24×24) |
| `CELL_SIZE` | `14` | Base cell size on desktop (px) |
| `MIN_SPEED_LEVEL` | `1` | Slowest speed |
| `MAX_SPEED_LEVEL` | `10` | Fastest speed |

On mobile, cell size is computed dynamically so the board fits the viewport.

## 🌐 Deployment

This is a static SPA. After `npm run build`, deploy the `dist/` folder to any static host, for example:

- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)

For GitHub Pages with a project site, set `base` in `vite.config.ts` to your repository name if needed.

## 📄 License

This project is open source. Feel free to use, modify, and distribute it.

## 👤 Author

**Armin Fatehi** — [@Arminfaa](https://github.com/Arminfaa)

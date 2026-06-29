import { useRef, useCallback } from 'react'
import type { Direction } from '../types'
import { GRID_SIZE, MIN_SPEED_LEVEL, MAX_SPEED_LEVEL } from '../utils'
import { useSnakeGame } from '../hooks/useSnakeGame'
import { useResponsiveCellSize, getBoardSize } from '../hooks/useResponsiveCellSize'

const SWIPE_THRESHOLD = 28

function DirectionPad({
  onDirection,
  disabled,
}: {
  onDirection: (dir: Direction) => void
  disabled: boolean
}) {
  return (
    <div className="direction-pad">
      <button
        type="button"
        className="pad-btn"
        disabled={disabled}
        onClick={() => onDirection('UP')}
        aria-label="Up"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4l-8 8h16z" />
        </svg>
      </button>
      <div className="pad-row">
        <button
          type="button"
          className="pad-btn"
          disabled={disabled}
          onClick={() => onDirection('LEFT')}
          aria-label="Left"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12l8-8v16z" />
          </svg>
        </button>
        <button
          type="button"
          className="pad-btn pad-btn-center"
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
        />
        <button
          type="button"
          className="pad-btn"
          disabled={disabled}
          onClick={() => onDirection('RIGHT')}
          aria-label="Right"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 12l-8-8v16z" />
          </svg>
        </button>
      </div>
      <button
        type="button"
        className="pad-btn"
        disabled={disabled}
        onClick={() => onDirection('DOWN')}
        aria-label="Down"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20l8-8H4z" />
        </svg>
      </button>
    </div>
  )
}

export default function SnakeGame() {
  const {
    snake,
    food,
    foodEmoji,
    score,
    highScore,
    gameOver,
    isPaused,
    hasStarted,
    speedLevel,
    changeDirection,
    updateSpeedLevel,
    reset,
    togglePause,
  } = useSnakeGame()

  const cellSize = useResponsiveCellSize()
  const boardSize = getBoardSize(cellSize)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current || gameOver) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStart.current.x
      const dy = touch.clientY - touchStart.current.y
      touchStart.current = null

      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return

      if (Math.abs(dx) > Math.abs(dy)) {
        changeDirection(dx > 0 ? 'RIGHT' : 'LEFT')
      } else {
        changeDirection(dy > 0 ? 'DOWN' : 'UP')
      }
    },
    [changeDirection, gameOver],
  )

  return (
    <div className="snake-game">
      <header className="game-header">
        <div className="header-brand">
          <span className="header-icon" aria-hidden="true">
            🐍
          </span>
          <h1>Snake Game</h1>
        </div>
        <p className="subtitle">Wrap through walls — don&apos;t hit yourself!</p>
      </header>

      <div className="game-hud">
        <div className="score-board">
          <div className="score-item">
            <span className="label">Score</span>
            <span className="value">{score}</span>
          </div>
          <div className="score-item">
            <span className="label">Best</span>
            <span className="value">{highScore}</span>
          </div>
        </div>

        <div className="speed-control">
          <label htmlFor="speed-slider" className="speed-label">
            <span>Game Speed</span>
            <span className="speed-value">{speedLevel}</span>
          </label>
          <input
            id="speed-slider"
            type="range"
            min={MIN_SPEED_LEVEL}
            max={MAX_SPEED_LEVEL}
            step={1}
            value={speedLevel}
            onChange={(e) => updateSpeedLevel(Number(e.target.value))}
            className="speed-slider"
          />
          <div className="speed-hints">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>

      <div className="game-area">
        <div
          className="board"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            width: boardSize,
            height: boardSize,
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
            ['--cell-size' as string]: `${cellSize}px`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE
            const y = Math.floor(i / GRID_SIZE)
            const isHead = snake[0]?.x === x && snake[0]?.y === y
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y)
            const isFood = food.x === x && food.y === y

            if (isFood) {
              return (
                <div key={i} className="cell food">
                  <span className="food-emoji" role="img" aria-label="Food">
                    {foodEmoji}
                  </span>
                </div>
              )
            }

            let cellClass = 'cell'
            if (isHead) cellClass += ' head'
            else if (isBody) cellClass += ' body'

            return <div key={i} className={cellClass} />
          })}

          {!hasStarted && !gameOver && (
            <div className="overlay">
              <p>Pick a direction to start</p>
            </div>
          )}

          {isPaused && !gameOver && (
            <div className="overlay">
              <p>Paused</p>
            </div>
          )}

          {gameOver && (
            <div className="overlay game-over">
              <p>Game Over!</p>
              <p className="final-score">Score: {score}</p>
            </div>
          )}
        </div>

        <DirectionPad onDirection={changeDirection} disabled={gameOver} />
      </div>

      <div className="controls">
        <button type="button" className="btn secondary" onClick={togglePause} disabled={gameOver}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        {gameOver && (
          <button type="button" className="btn primary" onClick={reset}>
            Play Again
          </button>
        )}
      </div>

      <footer className="help">
        <kbd>↑↓←→</kbd> or <kbd>WASD</kbd> to move — <kbd>Space</kbd> or <kbd>Esc</kbd> to pause
      </footer>

      <p className="mobile-hint">Swipe on the board or use the D-pad to move</p>
    </div>
  )
}

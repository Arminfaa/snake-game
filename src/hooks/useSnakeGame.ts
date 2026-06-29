import { useState, useEffect, useCallback, useRef } from 'react'
import type { Point, Direction } from '../types'
import {
  randomFood,
  randomFoodEmoji,
  wrapPosition,
  getTickInterval,
  loadHighScore,
  saveHighScore,
  loadSpeedLevel,
  saveSpeedLevel,
} from '../utils'

const OPPOSITES: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
}

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  s: 'DOWN',
  a: 'LEFT',
  d: 'RIGHT',
}

const INITIAL_SNAKE: Point[] = [{ x: 12, y: 12 }]

export function useSnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Point>(() => randomFood(INITIAL_SNAKE))
  const [foodEmoji, setFoodEmoji] = useState(randomFoodEmoji)
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(loadHighScore)
  const [isPaused, setIsPaused] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [speedLevel, setSpeedLevel] = useState(loadSpeedLevel)

  const directionRef = useRef(direction)
  directionRef.current = direction

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !hasStarted) return

    setSnake((prev) => {
      const head = prev[0]
      const dir = directionRef.current

      const rawHead: Point = {
        x: dir === 'LEFT' ? head.x - 1 : dir === 'RIGHT' ? head.x + 1 : head.x,
        y: dir === 'UP' ? head.y - 1 : dir === 'DOWN' ? head.y + 1 : head.y,
      }

      const newHead = wrapPosition(rawHead)

      if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        setGameOver(true)
        return prev
      }

      const ateFood = newHead.x === food.x && newHead.y === food.y
      const newSnake = [newHead, ...prev]

      if (ateFood) {
        setScore((s) => {
          const next = s + 10
          if (next > highScore) {
            setHighScore(next)
            saveHighScore(next)
          }
          return next
        })
        setFood(randomFood(newSnake))
        setFoodEmoji(randomFoodEmoji())
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [food, gameOver, hasStarted, highScore, isPaused])

  useEffect(() => {
    const id = setInterval(moveSnake, getTickInterval(speedLevel))
    return () => clearInterval(id)
  }, [moveSnake, speedLevel])

  const changeDirection = useCallback((newDir: Direction) => {
    if (newDir !== OPPOSITES[directionRef.current]) {
      setDirection(newDir)
      setHasStarted(true)
    }
  }, [])

  const updateSpeedLevel = useCallback((level: number) => {
    setSpeedLevel(level)
    saveSpeedLevel(level)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const newDir = KEY_MAP[e.key]
      if (newDir) {
        e.preventDefault()
        changeDirection(newDir)
        return
      }
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault()
        if (!gameOver) setIsPaused((p) => !p)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [changeDirection, gameOver])

  const reset = useCallback(() => {
    setSnake(INITIAL_SNAKE)
    setFood(randomFood(INITIAL_SNAKE))
    setFoodEmoji(randomFoodEmoji())
    setDirection('RIGHT')
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    setHasStarted(false)
  }, [])

  const togglePause = useCallback(() => {
    if (!gameOver) setIsPaused((p) => !p)
  }, [gameOver])

  return {
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
  }
}

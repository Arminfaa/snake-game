import type { Point } from './types'

export const GRID_SIZE = 24
export const CELL_SIZE = 14

export const FOOD_EMOJIS = ['🍎', '🍇', '🍒', '🍕', '🍔', '🌮', '🍩', '🍓', '🥑', '🍉']

export const MIN_SPEED_LEVEL = 1
export const MAX_SPEED_LEVEL = 10

export function randomFoodEmoji(): string {
  return FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]
}

export function randomFood(snake: Point[]): Point {
  let food: Point
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (snake.some((s) => s.x === food.x && s.y === food.y))
  return food
}

export function wrapPosition(point: Point): Point {
  return {
    x: ((point.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE,
    y: ((point.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE,
  }
}

export function getTickInterval(speedLevel: number): number {
  const clamped = Math.min(MAX_SPEED_LEVEL, Math.max(MIN_SPEED_LEVEL, speedLevel))
  const slowest = 300
  const fastest = 55
  return slowest - ((clamped - MIN_SPEED_LEVEL) / (MAX_SPEED_LEVEL - MIN_SPEED_LEVEL)) * (slowest - fastest)
}

export function loadHighScore(): number {
  const saved = localStorage.getItem('snake-high-score')
  return saved ? Number.parseInt(saved, 10) : 0
}

export function saveHighScore(score: number): void {
  localStorage.setItem('snake-high-score', String(score))
}

export function loadSpeedLevel(): number {
  const saved = localStorage.getItem('snake-speed-level')
  const parsed = saved ? Number.parseInt(saved, 10) : 4
  if (Number.isNaN(parsed)) return 4
  return Math.min(MAX_SPEED_LEVEL, Math.max(MIN_SPEED_LEVEL, parsed))
}

export function saveSpeedLevel(level: number): void {
  localStorage.setItem('snake-speed-level', String(level))
}

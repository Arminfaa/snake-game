import { useEffect, useState } from 'react'
import { GRID_SIZE, CELL_SIZE } from '../utils'

const BOARD_PADDING = 8
const GRID_GAP = 1

function computeCellSize(viewportWidth: number): number {
  const isMobile = viewportWidth < 640
  const horizontalPadding = isMobile ? 24 : 48
  const maxBoard = isMobile ? viewportWidth - horizontalPadding : 400
  const available = maxBoard - BOARD_PADDING - (GRID_SIZE - 1) * GRID_GAP
  const computed = Math.floor(available / GRID_SIZE)
  const minSize = isMobile ? 9 : CELL_SIZE
  const maxSize = isMobile ? 16 : CELL_SIZE
  return Math.max(minSize, Math.min(maxSize, computed))
}

export function useResponsiveCellSize(): number {
  const [cellSize, setCellSize] = useState(() =>
    typeof window !== 'undefined' ? computeCellSize(window.innerWidth) : CELL_SIZE,
  )

  useEffect(() => {
    const update = () => setCellSize(computeCellSize(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return cellSize
}

export function getBoardSize(cellSize: number): number {
  return GRID_SIZE * cellSize + (GRID_SIZE - 1)
}

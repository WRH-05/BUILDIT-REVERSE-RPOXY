export const TILE_SIZE = 64
export const ISO_TILE_HALF_WIDTH = TILE_SIZE / 2
export const ISO_TILE_HALF_HEIGHT = TILE_SIZE / 4

export const gridToIso = (gridX: number, gridY: number): { x: number; y: number } => {
  return {
    x: (gridX - gridY) * ISO_TILE_HALF_WIDTH,
    y: (gridX + gridY) * ISO_TILE_HALF_HEIGHT,
  }
}

export const getTileZIndex = (gridX: number, gridY: number): number => {
  return gridX + gridY
}

export const calculateOptimalScale = (
  cityPixelWidth: number,
  cityPixelHeight: number,
  containerWidth: number,
  containerHeight: number
): number => {
  const scaleX = containerWidth / cityPixelWidth
  const scaleY = containerHeight / cityPixelHeight
  const scale = Math.min(scaleX, scaleY)
  return Math.max(scale, 0.1)
}


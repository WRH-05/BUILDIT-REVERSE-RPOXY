import * as PIXI from 'pixi.js'
import { gridToIso, calculateOptimalScale, ISO_TILE_HALF_WIDTH, ISO_TILE_HALF_HEIGHT } from './utils/gridUtils'

export type CityBounds = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export const calculateCityBounds = (
  landWidth: number,
  landHeight: number
): CityBounds => {
  const topLeft = gridToIso(0, 0)
  const topRight = gridToIso(landWidth - 1, 0)
  const bottomLeft = gridToIso(0, landHeight - 1)
  const bottomRight = gridToIso(landWidth - 1, landHeight - 1)

  const minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x) - ISO_TILE_HALF_WIDTH
  const maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x) + ISO_TILE_HALF_WIDTH
  const minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y) - ISO_TILE_HALF_HEIGHT
  const maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y) + ISO_TILE_HALF_HEIGHT * 2

  return { minX, maxX, minY, maxY }
}

export const centerCity = (
  container: PIXI.Container,
  bounds: CityBounds,
  rendererWidth: number,
  rendererHeight: number
): { scale: number } => {
  const cityPixelWidth = bounds.maxX - bounds.minX
  const cityPixelHeight = bounds.maxY - bounds.minY

  const scale = calculateOptimalScale(cityPixelWidth, cityPixelHeight, rendererWidth, rendererHeight)
  container.scale.set(scale, scale)

  const scaledWidth = cityPixelWidth * scale
  const scaledHeight = cityPixelHeight * scale

  const centerX = (rendererWidth - scaledWidth) / 2 - bounds.minX * scale
  const centerY = (rendererHeight - scaledHeight) / 2 - bounds.minY * scale

  container.x = centerX
  container.y = centerY

  return { scale }
}

export const constrainCamera = (
  container: PIXI.Container,
  bounds: CityBounds,
  scale: number,
  rendererWidth: number,
  rendererHeight: number
): void => {
  const cityPixelWidth = (bounds.maxX - bounds.minX) * scale
  const cityPixelHeight = (bounds.maxY - bounds.minY) * scale

  const minX = rendererWidth - cityPixelWidth
  const minY = rendererHeight - cityPixelHeight
  const maxX = 0
  const maxY = 0

  container.x = Math.max(minX, Math.min(maxX, container.x))
  container.y = Math.max(minY, Math.min(maxY, container.y))
}


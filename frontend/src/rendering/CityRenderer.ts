import * as PIXI from 'pixi.js'
import { TILE_SIZE, gridToIso, getTileZIndex } from './utils/gridUtils'

export type Land = string[][]
export type Structures = Map<string, string>

export const generateLand = (levelIndex: number): Land => {
  const baseSize = 10
  const width = baseSize + levelIndex * 5
  const height = baseSize + levelIndex * 5
  
  const land: Land = []
  
  for (let y = 0; y < height; y++) {
    land[y] = []
    for (let x = 0; x < width; x++) {
      land[y][x] = 'grass'
    }
  }
  
  for (let y = 2; y < height; y += 4) {
    for (let x = 0; x < width; x++) {
      land[y][x] = 'asphalt'
    }
  }
  for (let x = 2; x < width; x += 4) {
    for (let y = 0; y < height; y++) {
      land[y][x] = 'asphalt'
    }
  }
  
  return land
}

export const generateStructures = (
  land: Land, 
  factoryCount: number,
  hospitalCount: number,
  houseCount: number,
  seed: number = Math.random()
): Structures => {
  const structures = new Map<string, string>()
  const width = land[0].length
  const height = land.length
  
  let seedValue = seed
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280
    return seedValue / 233280
  }
  
  const houseTypes = ['house1', 'house2', 'house3', 'house4', 'house5']
  const availablePositions: Array<{ x: number; y: number }> = []
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (land[y]?.[x] === 'grass') {
        availablePositions.push({ x, y })
      }
    }
  }
  
  for (let i = availablePositions.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]]
  }
  
  let positionIndex = 0
  
  for (let i = 0; i < houseCount && positionIndex < availablePositions.length; i++) {
    const pos = availablePositions[positionIndex]
    const houseType = houseTypes[Math.floor(seededRandom() * houseTypes.length)]
    structures.set(`${pos.x}-${pos.y}`, houseType)
    positionIndex++
  }
  
  for (let i = 0; i < factoryCount && positionIndex < availablePositions.length; i++) {
    const pos = availablePositions[positionIndex]
    structures.set(`${pos.x}-${pos.y}`, 'factory')
    positionIndex++
  }
  
  for (let i = 0; i < hospitalCount && positionIndex < availablePositions.length; i++) {
    const pos = availablePositions[positionIndex]
    structures.set(`${pos.x}-${pos.y}`, 'hospital')
    positionIndex++
  }
  
  return structures
}

export const renderLand = (
  container: PIXI.Container,
  land: Land,
  textures: Map<string, PIXI.Texture>
): void => {
  land.forEach((row, gridY) => {
    row.forEach((tileType, gridX) => {
      const texture = textures.get(tileType)
      if (!texture) return
      
      const sprite = new PIXI.Sprite(texture)
      const isoPos = gridToIso(gridX, gridY)
      const zIndex = getTileZIndex(gridX, gridY)
      
      sprite.x = isoPos.x
      sprite.y = isoPos.y
      sprite.width = TILE_SIZE
      sprite.height = TILE_SIZE
      sprite.anchor.set(0.5, 0)
      sprite.zIndex = zIndex
      
      container.addChild(sprite)
    })
  })
}

export const renderStructures = (
  container: PIXI.Container,
  structures: Structures,
  textures: Map<string, PIXI.Texture>
): void => {
  structures.forEach((structureType, key) => {
    const [gridX, gridY] = key.split('-').map(Number)
    const texture = textures.get(structureType)
    if (!texture) return
    
    const sprite = new PIXI.Sprite(texture)
    const isoPos = gridToIso(gridX, gridY)
    const zIndex = getTileZIndex(gridX, gridY) + 0.5
    
    const textureAspect = texture.width / texture.height
    
    if (textureAspect > 1) {
      sprite.width = TILE_SIZE * 1.2
      sprite.height = (TILE_SIZE * 1.2) / textureAspect
    } else {
      sprite.height = TILE_SIZE * 1.2
      sprite.width = (TILE_SIZE * 1.2) * textureAspect
    }
    
    sprite.x = isoPos.x
    sprite.y = isoPos.y
    sprite.anchor.set(0.5, 0.5)
    sprite.zIndex = zIndex
    
    container.addChild(sprite)
  })
}


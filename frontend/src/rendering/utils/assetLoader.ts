import * as PIXI from 'pixi.js'

export const getAssetPath = (assetType: string): string => {
  const assets: Record<string, string> = {
    grass: '/assets/FreeAssets/Tile_Grass.png',
    asphalt: '/assets/FreeAssets/Tile_Asfalt.png',
    dirt: '/assets/FreeAssets/Tile_Dirt.png',
    water: '/assets/FreeAssets/Tile_Water.png',
    house1: '/assets/FreeAssets/Building_House1.png',
    house2: '/assets/FreeAssets/Building_House2.png',
    house3: '/assets/FreeAssets/Building_House3.png',
    house4: '/assets/FreeAssets/Building_House4.png',
    house5: '/assets/FreeAssets/Building_House5.png',
    factory: '/assets/FreeAssets/Building_Appartment_Level2.png',
    hospital: '/assets/FreeAssets/Building_Doctor.png',
    shop: '/assets/FreeAssets/Building_Groceries.png',
    restaurant: '/assets/FreeAssets/Building_Restaurant.png',
    cinema: '/assets/FreeAssets/Building_Cinema.png',
    school: '/assets/FreeAssets/Building_School.png',
    tree: '/assets/FreeAssets/Tree1.png',
  }
  
  return assets[assetType] || assets.grass
}

export const loadTextures = async (): Promise<Map<string, PIXI.Texture>> => {
  const textures = new Map<string, PIXI.Texture>()
  const assetPaths = [
    'grass', 'asphalt', 'dirt', 'water',
    'house1', 'house2', 'house3', 'house4', 'house5',
    'factory', 'hospital', 'shop', 'restaurant', 'cinema', 'school', 'tree'
  ]
  
  for (const assetType of assetPaths) {
    const path = getAssetPath(assetType)
    if (path) {
      try {
        const texture = await PIXI.Assets.load(path)
        textures.set(assetType, texture)
      } catch (error) {
        console.warn(`Failed to load texture: ${path}`, error)
      }
    }
  }
  
  return textures
}


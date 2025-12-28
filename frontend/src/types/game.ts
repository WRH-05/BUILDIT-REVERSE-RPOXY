export type WeatherData = {
  temperature: number
  wind_speed: number
  condition: string
  humidity: number
}

export type AirQualityData = {
  aqi: number
  level: string
}

export type WorldData = {
  weather: WeatherData
  economyMultiplier: number
  airQuality: AirQualityData
}

export type GameState = {
  sp: number
  health: number
  energy: number
  clickPower: number
  lost: boolean
  gameStarted: boolean
}

export type UpgradeState = {
  cursorCount: number
  healthStabilizerActiveTime: number
  powerStabilizerActiveTime: number
  cursorCost: number
  healthStabilizerCost: number
  powerStabilizerCost: number
  factoryCost: number
  hospitalCost: number
}


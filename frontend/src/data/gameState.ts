export { IDEAL_TEMPERATURE } from '../constants/game'
export type { WeatherData, AirQualityData, WorldData } from '../types/game'
export { calculateTemperatureDamage } from '../systems/TemperatureSystem'
export { calculateMultipliers } from '../systems/EconomySystem'

export const getPlaceholderWorldData = (): import('../types/game').WorldData => {
  const temperatures = [20, 22, 25, 28, 30, 15, 18, 32]
  const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)]
  
  return {
    weather: {
      temperature: randomTemp,
      wind_speed: 5,
      condition: "Sunny",
      humidity: 65,
    },
    economyMultiplier: 1.2,
    airQuality: {
      aqi: 45,
      level: "Good",
    },
  }
}

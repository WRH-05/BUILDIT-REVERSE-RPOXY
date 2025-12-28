import { IDEAL_AIR_QUALITY } from '../constants/game'

export type AirQualityDamage = {
  healthDamage: number
  energyDamage: number
}

export const calculateAirQualityDamage = (aqi: number): AirQualityDamage => {
  const aqiDiff = Math.abs(aqi - IDEAL_AIR_QUALITY)
  
  const damageRate = aqiDiff * 0.02
  
  return {
    healthDamage: damageRate,
    energyDamage: damageRate,
  }
}


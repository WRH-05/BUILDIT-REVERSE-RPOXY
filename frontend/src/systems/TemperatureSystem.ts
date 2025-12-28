import { IDEAL_TEMPERATURE } from '../constants/game'

export type TemperatureDamage = {
  healthDamage: number
  energyDamage: number
}

export const calculateTemperatureDamage = (temperature: number): TemperatureDamage => {
  const tempDiff = Math.abs(temperature - IDEAL_TEMPERATURE)
  
  const damageRate = tempDiff * 0.2
  
  return {
    healthDamage: damageRate,
    energyDamage: damageRate,
  }
}

export const applyStabilizerReduction = (
  damage: number,
  hasStabilizer: boolean
): number => {
  return hasStabilizer ? damage * 0.5 : damage
}


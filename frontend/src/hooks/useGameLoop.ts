import { useEffect } from 'react'
import { calculateTemperatureDamage, applyStabilizerReduction } from '../systems/TemperatureSystem'
import { calculateAirQualityDamage } from '../systems/AirQualitySystem'
import { calculateMultipliers, calculateIdleSP } from '../systems/EconomySystem'
import { StabilizerMechanic } from '../game/mechanics/StabilizerMechanic'
import type { WorldData } from '../types/game'

type GameLoopOptions = {
  gameStarted: boolean
  lost: boolean
  worldData: WorldData | null
  healthStabilizerActiveTime: number
  powerStabilizerActiveTime: number
  onTick: (updates: {
    health: number
    energy: number
    sp: number
    healthStabilizerActiveTime: number
    powerStabilizerActiveTime: number
  }) => void
}

export const useGameLoop = ({
  gameStarted,
  lost,
  worldData,
  healthStabilizerActiveTime,
  powerStabilizerActiveTime,
  onTick,
}: GameLoopOptions) => {
  useEffect(() => {
    if (!gameStarted || lost || !worldData) return

    const tickInterval = setInterval(() => {
      const multipliers = calculateMultipliers(worldData)
      const temperatureDamage = calculateTemperatureDamage(worldData.weather.temperature)
      const airQualityDamage = calculateAirQualityDamage(worldData.airQuality.aqi)

      // Combine temperature and air quality damage
      const totalHealthDamage = temperatureDamage.healthDamage + airQualityDamage.healthDamage
      const totalEnergyDamage = temperatureDamage.energyDamage + airQualityDamage.energyDamage

      const healthDamageReduction = StabilizerMechanic.isHealthStabilizerActive(healthStabilizerActiveTime) ? 0.5 : 1
      const energyDamageReduction = StabilizerMechanic.isPowerStabilizerActive(powerStabilizerActiveTime) ? 0.5 : 1

      const healthDamage = applyStabilizerReduction(totalHealthDamage, healthDamageReduction < 1)
      const energyDamage = applyStabilizerReduction(totalEnergyDamage, energyDamageReduction < 1)

      const newHealthStabilizerTime = StabilizerMechanic.decreaseTimer(healthStabilizerActiveTime)
      const newPowerStabilizerTime = StabilizerMechanic.decreaseTimer(powerStabilizerActiveTime)

      const idleSP = calculateIdleSP(multipliers.economyMultiplier)

      onTick({
        health: healthDamage,
        energy: energyDamage,
        sp: idleSP,
        healthStabilizerActiveTime: newHealthStabilizerTime,
        powerStabilizerActiveTime: newPowerStabilizerTime,
      })
    }, 1000)

    return () => clearInterval(tickInterval)
  }, [gameStarted, lost, worldData, healthStabilizerActiveTime, powerStabilizerActiveTime, onTick])
}


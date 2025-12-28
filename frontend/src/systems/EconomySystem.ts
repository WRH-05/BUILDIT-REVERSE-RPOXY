import { IDLE_SP_RATE } from '../constants/game'
import type { WorldData } from '../types/game'

export const calculateMultipliers = (worldData: WorldData) => {
  return {
    economyMultiplier: worldData.economyMultiplier,
  }
}

export const calculateClickSP = (
  clickPower: number,
  economyMultiplier: number
): number => {
  return clickPower * economyMultiplier
}

export const calculateIdleSP = (economyMultiplier: number): number => {
  return IDLE_SP_RATE * economyMultiplier
}

export const calculateCursorSP = (
  cursorCount: number,
  clicksPerMinute: number,
  clickPower: number,
  economyMultiplier: number
): number => {
  const totalClicks = cursorCount * clicksPerMinute
  const spPerClick = clickPower * economyMultiplier
  return totalClicks * spPerClick
}


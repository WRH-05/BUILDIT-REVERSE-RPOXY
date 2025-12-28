import { useEffect } from 'react'
import { calculateCursorSP, calculateMultipliers } from '../systems/EconomySystem'
import type { WorldData } from '../types/game'

type CursorAutoClickOptions = {
  gameStarted: boolean
  lost: boolean
  worldData: WorldData | null
  cursorCount: number
  clicksPerMinute: number
  clickPower: number
  onSPGenerated: (amount: number) => void
}

export const useCursorAutoClick = ({
  gameStarted,
  lost,
  worldData,
  cursorCount,
  clicksPerMinute,
  clickPower,
  onSPGenerated,
}: CursorAutoClickOptions) => {
  useEffect(() => {
    if (!gameStarted || lost || !worldData || cursorCount === 0) return

    const cursorInterval = setInterval(() => {
      const multipliers = calculateMultipliers(worldData)
      const totalSP = calculateCursorSP(
        cursorCount,
        clicksPerMinute,
        clickPower,
        multipliers.economyMultiplier
      )
      
      onSPGenerated(totalSP)
    }, 60000)

    return () => clearInterval(cursorInterval)
  }, [gameStarted, lost, worldData, cursorCount, clicksPerMinute, clickPower, onSPGenerated])
}


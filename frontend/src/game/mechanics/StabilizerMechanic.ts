import { HEALTH_STABILIZER_DURATION, POWER_STABILIZER_DURATION } from '../../constants/game'

export class StabilizerMechanic {
  static readonly HEALTH_DURATION = HEALTH_STABILIZER_DURATION
  static readonly POWER_DURATION = POWER_STABILIZER_DURATION

  static isHealthStabilizerActive(activeTime: number): boolean {
    return activeTime > 0
  }

  static isPowerStabilizerActive(activeTime: number): boolean {
    return activeTime > 0
  }

  static decreaseTimer(activeTime: number): number {
    return Math.max(0, activeTime - 1)
  }
}


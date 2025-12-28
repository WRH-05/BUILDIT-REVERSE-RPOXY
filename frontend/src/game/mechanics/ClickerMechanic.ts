import { calculateClickSP } from '../../systems/EconomySystem'

export class ClickerMechanic {
  static calculateSPGain(clickPower: number, economyMultiplier: number): number {
    return calculateClickSP(clickPower, economyMultiplier)
  }
}


import { clamp } from '../utils/math'

export class EnergySystem {
  static applyDamage(currentEnergy: number, damage: number): number {
    return clamp(currentEnergy - damage, 0, 100)
  }

  static restore(currentEnergy: number, amount: number): number {
    return clamp(currentEnergy + amount, 0, 100)
  }

  static isCritical(energy: number, threshold: number = 20): boolean {
    return energy <= threshold
  }
}


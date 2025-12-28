import { clamp } from '../utils/math'

export class HealthSystem {
  static applyDamage(currentHealth: number, damage: number): number {
    return clamp(currentHealth - damage, 0, 100)
  }

  static restore(currentHealth: number, amount: number): number {
    return clamp(currentHealth + amount, 0, 100)
  }

  static isCritical(health: number, threshold: number = 20): boolean {
    return health <= threshold
  }
}


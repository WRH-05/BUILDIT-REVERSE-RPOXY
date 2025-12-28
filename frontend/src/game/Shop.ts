import { COST_MULTIPLIER, INITIAL_COSTS } from '../constants/game'

export type ShopItem = 'cursor' | 'healthStabilizer' | 'powerStabilizer' | 'factory' | 'hospital' | 'house'

export class Shop {
  static getCost(currentCost: number): number {
    return currentCost
  }

  static getNextCost(currentCost: number): number {
    return Math.floor(currentCost * COST_MULTIPLIER)
  }

  static getInitialCost(item: ShopItem): number {
    return INITIAL_COSTS[item]
  }

  static canAfford(sp: number, cost: number): boolean {
    return sp >= cost
  }

  static purchase(sp: number, cost: number): { newSP: number; success: boolean } {
    if (!this.canAfford(sp, cost)) {
      return { newSP: sp, success: false }
    }
    return { newSP: sp - cost, success: true }
  }
}


import { Material } from './material'

export class Detail {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly materials: Material[],
    readonly costs: number[] = []
  ) { }

  calcCost(qty: number) {
    return this.materials.map((each, idx) => {
      const perUnitCost = this.costs[idx] || 0

      return {
        meterial: each,
        cost: (perUnitCost * qty).toFixed(3)
      }
    })
  }
}

import { Material } from './materials'

export class Supply {
  constructor(
    readonly id: number,
    readonly material: Material,
    readonly qty: number,
    readonly suppliedAt: Date,
    readonly supplierName: string
  ) {}
}

import { EnWriteoffReason, EnWriteoffType } from './enums'
import { Material } from './material'

export class Writeoff {
  constructor(
    readonly id: number,
    readonly date: Date,
    readonly qty: number,
    readonly reason: EnWriteoffReason,
    readonly material: Material,
    readonly type: EnWriteoffType,
    readonly typeData: WriteoffTroughDetail | WriteoffDirectUnit
  ) {}
}

export interface WriteoffTroughDetail {
  detailId: number
  qty: number
  totalCost: number
}

export interface WriteoffDirectUnit {}

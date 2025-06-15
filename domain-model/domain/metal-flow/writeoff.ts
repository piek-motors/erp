import { EnWriteoffReason, EnWriteoffType } from './enums'
import { Material } from './materials'

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

export type WriteoffTroughDetail = {
  detailId: number
  qty: number
}

export type WriteoffDirectUnit = {}

export type WriteoffTypeDataUnion = WriteoffTroughDetail | WriteoffDirectUnit

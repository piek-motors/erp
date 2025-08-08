import { EnUnit, EnWriteoffReason, EnWriteoffType } from './enums'

interface Material {
  id: number
  label: string
  unit: EnUnit
}

export class Writeoff {
  id!: number
  date!: Date
  qty!: number
  reason!: EnWriteoffReason
  material!: Material
  type!: EnWriteoffType
  typeData!: WriteoffTroughDetail | WriteoffDirectUnit
}

export type WriteoffTroughDetail = {
  detailId: number
  qty: number
}

export type WriteoffDirectUnit = {}

export type WriteoffTypeDataUnion = WriteoffTroughDetail | WriteoffDirectUnit

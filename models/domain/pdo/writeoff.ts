import type { Unit, WriteoffReason, WriteoffType } from './enums'

interface Material {
	id: number
	label: string
	unit: Unit
}

export class Writeoff {
	id!: number
	date!: Date
	qty!: number
	reason!: WriteoffReason
	material!: Material
	type!: WriteoffType
	typeData!: WriteoffTroughDetail | WriteoffDirectUnit
}

export type WriteoffTroughDetail = {
	detailId: number
	qty: number
}

export type WriteoffDirectUnit = {}

export type WriteoffTypeDataUnion = WriteoffTroughDetail | WriteoffDirectUnit

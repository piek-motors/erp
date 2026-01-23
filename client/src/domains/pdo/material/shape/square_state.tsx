import { makeAutoObservable } from 'mobx'
import type { SquareBar, SquareBarShapeData } from 'models'
import type { IMaterialShapeState } from '../shape_state.interface'

export class SquareState implements IMaterialShapeState {
	length?: number
	setLength(length?: number) {
		this.length = length
	}
	constructor() {
		makeAutoObservable(this)
	}
	export(): SquareBarShapeData {
		return {
			length: Number(this.length),
		} satisfies SquareBarShapeData
	}
	sync(material: SquareBar): void {
		this.length = material.length || 0
	}
	reset(): void {
		this.length = 0
	}
}

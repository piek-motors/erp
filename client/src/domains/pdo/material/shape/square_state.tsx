import { makeAutoObservable } from 'mobx'
import { SquareBar, SquareBarShapeData } from 'models'
import { IMaterialShapeState } from '../shape_state.interface'

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
      length: Number(this.length)
    } satisfies SquareBarShapeData
  }
  sync(material: SquareBar): void {
    this.length = material.length || 0
  }
  reset(): void {
    this.length = 0
  }
}

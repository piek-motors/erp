import { makeAutoObservable } from 'mobx'
import { SquareBar, SquareBarShapeData } from 'models'
import { IMaterialShapeState } from '../shape_state.interface'

export class SquareState implements IMaterialShapeState {
  length!: string
  setLength(length: string) {
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
    this.length = material.length?.toString() || ''
  }
  reset(): void {
    this.length = ''
  }
}

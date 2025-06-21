import { SquareBar, SquareBarShapeData } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { IMaterialShapeState } from '../store/matetial_shape_state.interface'

export class SquareState implements IMaterialShapeState {
  length!: string
  setLength(length: string) {
    this.length = length
  }
  alloy!: string
  setAlloy(alloy: string) {
    this.alloy = alloy
  }
  constructor() {
    makeAutoObservable(this)
  }
  export(): SquareBarShapeData {
    return {
      length: Number(this.length),
      alloy: this.alloy
    } satisfies SquareBarShapeData
  }
  sync(material: SquareBar): void {
    this.length = material.length?.toString() || ''
    this.alloy = material.alloy || ''
  }
  reset(): void {
    this.length = ''
    this.alloy = ''
  }
}

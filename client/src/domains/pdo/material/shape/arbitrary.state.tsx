import { makeAutoObservable } from 'mobx'
import type { Arbitrary, ArbitraryShapeData } from 'models'
import type { IMaterialShapeState } from '../shape_state.interface'

export class ArbitraryState implements IMaterialShapeState {
  name: string = ''
  setName(name: string) {
    this.name = name
  }
  constructor() {
    makeAutoObservable(this)
  }
  export(): ArbitraryShapeData {
    return {
      name: this.name,
    } satisfies ArbitraryShapeData
  }
  sync(material: Arbitrary): void {
    this.name = material.name
  }
  reset(): void {
    this.name = ''
  }
}

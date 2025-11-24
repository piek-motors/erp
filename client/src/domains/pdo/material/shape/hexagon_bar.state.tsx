import { makeAutoObservable } from 'mobx'
import { HexagonBar, HexagonBarShapeData } from 'models'
import { IMaterialShapeState } from '../shape_state.interface'

export class HexagonBarState implements IMaterialShapeState {
  diameter?: number
  setDiameter(diameter?: number) {
    this.diameter = diameter
  }
  constructor() {
    makeAutoObservable(this)
  }
  export(): unknown {
    return {
      diameter: Number(this.diameter)
    } satisfies HexagonBarShapeData
  }
  sync(material: HexagonBar): void {
    this.diameter = material.diameter
  }
  reset(): void {
    this.diameter = 0
  }
}

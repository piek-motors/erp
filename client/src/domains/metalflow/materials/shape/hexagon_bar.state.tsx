import { makeAutoObservable } from 'mobx'
import { HexagonBar, HexagonBarShapeData } from 'models'
import { IMaterialShapeState } from '../shape_state.interface'

export class HexagonBarState implements IMaterialShapeState {
  diameter!: string
  setDiameter(diameter: string) {
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
    this.diameter = material.diameter?.toString() || ''
  }
  reset(): void {
    this.diameter = ''
  }
}

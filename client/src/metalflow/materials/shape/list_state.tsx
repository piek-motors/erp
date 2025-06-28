import { List, ListShapeData } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { IMaterialShapeState } from '../matetial_shape_state.interface'

export class ListState implements IMaterialShapeState {
  thickness!: string
  setThickness(thickness: string) {
    this.thickness = thickness
  }
  width!: string
  setWidth(width: string) {
    this.width = width
  }
  alloy!: string
  setAlloy(alloy: string) {
    this.alloy = alloy
  }
  constructor() {
    makeAutoObservable(this)
  }
  export(): ListShapeData {
    return {
      alloy: this.alloy,
      thickness: Number(this.thickness),
      width: Number(this.width)
    } satisfies ListShapeData
  }
  sync(material: List): void {
    this.thickness = material.thickness?.toString() || ''
    this.width = material.width?.toString() || ''
    this.alloy = material.alloy || ''
  }
  reset(): void {
    this.thickness = ''
    this.width = ''
    this.alloy = ''
  }
}

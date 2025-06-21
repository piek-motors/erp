import { Pipe, PipeShapeData } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { IMaterialShapeState } from '../store/matetial_shape_state.interface'

export class PipeState implements IMaterialShapeState {
  diameter!: string
  setDiameter(diameter: string) {
    this.diameter = diameter
  }
  thickness!: string
  setThickness(thickness: string) {
    this.thickness = thickness
  }
  alloy!: string
  setAlloy(alloy: string) {
    this.alloy = alloy
  }
  constructor() {
    makeAutoObservable(this)
  }
  export(): PipeShapeData {
    return {
      diameter: Number(this.diameter),
      thickness: Number(this.thickness),
      alloy: this.alloy
    } satisfies PipeShapeData
  }
  sync(material: Pipe): void {
    this.diameter = material.diameter?.toString() || ''
    this.thickness = material.thickness?.toString() || ''
    this.alloy = material.alloy || ''
  }
  reset(): void {
    this.diameter = ''
    this.thickness = ''
    this.alloy = ''
  }
}

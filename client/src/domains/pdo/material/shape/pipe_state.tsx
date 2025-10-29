import { makeAutoObservable } from 'mobx'
import { Pipe, PipeShapeData } from 'models'
import { IMaterialShapeState } from '../shape_state.interface'

export class PipeState implements IMaterialShapeState {
  diameter!: number
  setDiameter(diameter: number) {
    this.diameter = diameter
  }
  thickness!: number
  setThickness(thickness: number) {
    this.thickness = thickness
  }
  constructor() {
    makeAutoObservable(this)
  }
  export(): PipeShapeData {
    return {
      diameter: Number(this.diameter),
      thickness: Number(this.thickness)
    } satisfies PipeShapeData
  }
  sync(material: Pipe): void {
    this.diameter = material.diameter
    this.thickness = material.thickness
  }
  reset(): void {
    this.diameter = 0
    this.thickness = 0
  }
}

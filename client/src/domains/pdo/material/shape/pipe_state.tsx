import { makeAutoObservable } from 'mobx'
import type { Pipe, PipeShapeData } from 'models'
import type { IMaterialShapeState } from '../shape_state.interface'

export class PipeState implements IMaterialShapeState {
  diameter: number | null = null
  setDiameter(diameter: number | null) {
    this.diameter = diameter
  }
  thickness: number | null = null
  setThickness(thickness: number | null) {
    this.thickness = thickness
  }
  constructor() {
    makeAutoObservable(this)
  }
  export(): PipeShapeData {
    return {
      diameter: Number(this.diameter),
      thickness: Number(this.thickness),
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

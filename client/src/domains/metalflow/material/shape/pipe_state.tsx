import { makeAutoObservable } from 'mobx'
import { Pipe, PipeShapeData } from 'models'
import { IMaterialShapeState } from '../shape_state.interface'

export class PipeState implements IMaterialShapeState {
  diameter!: string
  setDiameter(diameter: string) {
    this.diameter = diameter
  }
  thickness!: string
  setThickness(thickness: string) {
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
    this.diameter = material.diameter?.toString() || ''
    this.thickness = material.thickness?.toString() || ''
  }
  reset(): void {
    this.diameter = ''
    this.thickness = ''
  }
}

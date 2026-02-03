import { makeAutoObservable } from 'mobx'
import type { List, ListShapeData } from 'models'
import type { IMaterialShapeState } from '../shape_state.interface'

export class ListState implements IMaterialShapeState {
  thickness?: number
  setThickness(thickness?: number) {
    this.thickness = thickness
  }
  width!: number
  setWidth(width: number) {
    this.width = width
  }
  constructor() {
    makeAutoObservable(this)
  }
  export(): ListShapeData {
    return {
      thickness: Number(this.thickness),
      width: Number(this.width),
    } satisfies ListShapeData
  }
  sync(material: List): void {
    this.thickness = material.thickness
    this.width = material.width || 0
  }
  reset(): void {
    this.thickness = 0
    this.width = 0
  }
}

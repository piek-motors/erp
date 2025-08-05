import { List, ListShapeData } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { IMaterialShapeState } from '../shape_state.interface'

export class ListState implements IMaterialShapeState {
  thickness!: string
  setThickness(thickness: string) {
    this.thickness = thickness
  }
  width!: string
  setWidth(width: string) {
    this.width = width
  }
  constructor() {
    makeAutoObservable(this)
  }
  export(): ListShapeData {
    return {
      thickness: Number(this.thickness),
      width: Number(this.width)
    } satisfies ListShapeData
  }
  sync(material: List): void {
    this.thickness = material.thickness?.toString() || ''
    this.width = material.width?.toString() || ''
  }
  reset(): void {
    this.thickness = ''
    this.width = ''
  }
}

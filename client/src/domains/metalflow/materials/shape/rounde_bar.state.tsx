import { RoundBar, RoundBarShapeData } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { IMaterialShapeState } from '../shape_state.interface'

export class RoundBarState implements IMaterialShapeState {
  diameter!: string
  setDiameter(diameter: string) {
    this.diameter = diameter
  }
  density!: string
  setDensity(density: string) {
    this.density = density
  }
  calibrated!: boolean
  setCalibrated(calibrated: boolean) {
    this.calibrated = calibrated
  }
  constructor() {
    makeAutoObservable(this)
  }
  export(): RoundBarShapeData {
    return {
      diameter: Number(this.diameter),
      calibrated: this.calibrated,
      density: Number(this.density)
    } satisfies RoundBarShapeData
  }
  sync(material: RoundBar): void {
    this.diameter = material.diameter?.toString() || ''
    this.density = material.density?.toString() || ''
    this.calibrated = material.calibrated || false
  }
  reset(): void {
    this.diameter = ''
    this.density = ''
    this.calibrated = false
  }
}

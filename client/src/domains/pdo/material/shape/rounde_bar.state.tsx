import { makeAutoObservable } from 'mobx'
import type { RoundBar, RoundBarShapeData } from 'models'
import type { IMaterialShapeState } from '../shape_state.interface'

export class RoundBarState implements IMaterialShapeState {
  diameter: number | null = null
  setDiameter(diameter: number | null) {
    this.diameter = diameter
  }
  calibrated: boolean = false
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
    } satisfies RoundBarShapeData
  }
  sync(material: RoundBar): void {
    this.diameter = material.diameter
    this.calibrated = material.calibrated || false
  }
  reset(): void {
    this.diameter = 0
    this.calibrated = false
  }
}

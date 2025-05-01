import { EnMaterialShape } from './enumerations'

export abstract class MaterialShape {
  static shapeTitle: string
  abstract getIdentifier(): string
}

export class CircleShapeData extends MaterialShape {
  static shapeTitle = 'Круг'
  /** Diameter mm  */
  diameter!: string
  /** Alloy type or material grade. */
  alloy!: string
  /**
   * Whether the material has undergone calibration —
   * an additional machining process to achieve precise geometrical parameters (e.g., diameter)
   * and to improve surface quality.
   */
  calibrated!: boolean
  /** Density in kilograms per cubic meter (kg/m³). */
  density!: string
  /** Linear mass in kilograms per meter (kg/m). */
  linearMass!: number
  getIdentifier(): string {
    return `${CircleShapeData.shapeTitle} D${this.diameter} ${this.alloy}`
  }
}

export class ListShapeData extends MaterialShape {
  static shapeTitle = 'Лист'
  /** Length in centimeters (cm). */
  length!: string
  /** Width in centimeters (cm). */
  width!: string
  /** Thickness in centimeters (cm). */
  thickness!: string
  getIdentifier(): string {
    return `${ListShapeData.shapeTitle} ${this.length}x${this.width}x${this.thickness}`
  }
}

export class PipeShapeData extends MaterialShape {
  static shapeTitle = 'Труба'
  /** Diameter in (mm). */
  diameter!: number
  /** Alloy type or material grade. */
  alloy!: string
  /** Thickness (mm). */
  thickness!: number
  getIdentifier(): string {
    return `${PipeShapeData.shapeTitle} D${this.diameter} ${this.alloy}`
  }
}

/**
 * Unified type for material shapes.
 */
export type MaterialShapeData = {
  [EnMaterialShape.Circle]: CircleShapeData
  [EnMaterialShape.List]: ListShapeData
  [EnMaterialShape.Pipe]: PipeShapeData
}

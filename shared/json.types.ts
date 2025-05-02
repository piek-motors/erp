import { EnMaterialShape } from './enumerations'

export abstract class MaterialShape {
  static shapeTitle: string
  abstract getIdentifier(): string
}

export class CircleShapeData extends MaterialShape {
  static shapeTitle = 'Круг'
  /** Diameter mm  */
  diameter!: number
  /** Alloy type or material grade. */
  alloy!: string
  /**
   * Whether the material has undergone calibration —
   * an additional machining process to achieve precise geometrical parameters (e.g., diameter)
   * and to improve surface quality.
   */
  calibrated!: boolean
  /** Density in kilograms per cubic meter (kg/m³). */
  density!: number
  /** Linear mass in kilograms per meter (kg/m). */
  linearMass!: number
  getIdentifier(): string {
    return `${CircleShapeData.shapeTitle} D${this.diameter} ${this.alloy}`
  }
}

export class ListShapeData extends MaterialShape {
  static shapeTitle = 'Лист'
  g!: number
  getIdentifier(): string {
    return `${ListShapeData.shapeTitle} G ${this.g}`
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

export class SquareShapeData extends MaterialShape {
  static shapeTitle = 'Квадрат'
  /** Length in mm */
  length!: number
  /** Alloy type or material grade. */
  alloy!: string
  getIdentifier(): string {
    return `${SquareShapeData.shapeTitle} ${this.length}x${this.alloy}`
  }
}

/**
 * Unified type for material shapes.
 */
export type MaterialShapeData = {
  [EnMaterialShape.Circle]: CircleShapeData
  [EnMaterialShape.List]: ListShapeData
  [EnMaterialShape.Pipe]: PipeShapeData
  [EnMaterialShape.Square]: SquareShapeData
}

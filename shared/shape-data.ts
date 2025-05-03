import { EnMaterialShape } from './enumerations'

type Flag = {
  color: number
  text: string
}

export interface ResourceNameProps {
  name: string
  caption?: string
  flags?: Flag[]
}

export abstract class MaterialShapeData {
  static shapeTitle: string
  abstract getIdentifier(): string
  abstract getResourceNameProps(): ResourceNameProps

  update(key: string, value: any) {
    return Object.assign(this, { [key]: value })
  }
}

export class CircleShapeData extends MaterialShapeData {
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
    return `${CircleShapeData.shapeTitle} ${this.diameter} ${this.alloy}`
  }
  getResourceNameProps(): ResourceNameProps {
    return {
      name: `${CircleShapeData.shapeTitle} D${this.diameter}`,
      caption: this.alloy,
      flags: [
        {
          color: 1,
          text: this.calibrated ? 'Калиброван' : ''
        }
      ]
    }
  }
}

export class ListShapeData extends MaterialShapeData {
  static shapeTitle = 'Лист'
  g!: number
  getIdentifier(): string {
    return `${ListShapeData.shapeTitle} G ${this.g}`
  }
  getResourceNameProps(): ResourceNameProps {
    return {
      name: `${ListShapeData.shapeTitle} G ${this.g}`
    }
  }
}

export class PipeShapeData extends MaterialShapeData {
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
  getResourceNameProps(): ResourceNameProps {
    throw new Error('Method not implemented.')
  }
}

export class SquareShapeData extends MaterialShapeData {
  static shapeTitle = 'Квадрат'
  /** Length in mm */
  length!: number
  /** Alloy type or material grade. */
  alloy!: string
  getIdentifier(): string {
    return `${SquareShapeData.shapeTitle} ${this.length}x${this.alloy}`
  }
  getResourceNameProps(): ResourceNameProps {
    throw new Error('Method not implemented.')
  }
}

/**
 * Unified type for material shapes.
 */
export const MaterialShapeDataConstructor = {
  [EnMaterialShape.Circle]: CircleShapeData,
  [EnMaterialShape.List]: ListShapeData,
  [EnMaterialShape.Pipe]: PipeShapeData,
  [EnMaterialShape.Square]: SquareShapeData
}

// Union of the values (constructors/types)
type MaterialShapeDataUnion =
  (typeof MaterialShapeDataConstructor)[keyof typeof MaterialShapeDataConstructor]

export function getShapeDataConstructor(shapeId: number) {
  // @ts-ignore
  return MaterialShapeDataConstructor[shapeId] || null
}

import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { EnMaterialShape, EnUnit } from './enums'
import { uiMaterialShape, uiUnit } from './ui.translators'

export abstract class Material {
  @IsNumber()
  readonly id: number
  @IsString()
  label: string
  stock: number = 0
  abstract readonly unit: EnUnit
  abstract readonly shape: EnMaterialShape
  constructor(id: number, label: string = '') {
    this.id = id
    this.label = label
  }
  get unitUI() {
    return uiUnit(this.unit)
  }
  get shapeUI() {
    return uiMaterialShape(this.shape)
  }
  abstract deriveLabel(): string
}

export class RoundBar extends Material {
  unit = EnUnit.Kg
  shape = EnMaterialShape.RoundBar
  /**
   * Diameter of the round bar in millimeters (mm).
   * This is the primary dimension used for identification and calculations.
   */
  @IsNumber()
  @Min(0)
  diameter!: number
  /**
   * Material grade or alloy type (e.g., "медь", "алюминий").
   * Used for material identification and properties lookup.
   */
  @IsString()
  alloy!: string
  /**
   * Indicates if the material has undergone calibration process.
   * Calibration is an additional machining process that improves:
   * - Surface quality
   * - Dimensional accuracy
   * - Geometric parameters
   */
  @IsBoolean()
  calibrated!: boolean
  /**
   * Material density in kilograms per cubic meter (kg/m³).
   * Used for mass calculations and material identification.
   */
  @IsNumber()
  @Min(0)
  density!: number
  /**
   * Linear mass in kilograms per meter (kg/m).
   * Represents the weight of one meter of the material.
   * Used for quick mass calculations without volume computation.
   */
  @IsNumber()
  @Min(0)
  linearMass!: number
  deriveLabel(): string {
    if (Number.isNaN(this.diameter)) {
      throw new Error('diameter is NaN')
    }
    const calibrationSuffix = this.calibrated ? 'К' : ''
    return `${this.shapeUI} ${this.diameter} ${this.alloy} ${calibrationSuffix}`.trim()
  }
}

export class List extends Material {
  unit = EnUnit.Kg
  shape = EnMaterialShape.List
  /**
   * Thickness of the sheet in millimeters (mm).
   * This is the primary dimension used for identification and calculations.
   */
  @IsNumber()
  @Min(0)
  thickness!: number
  /**
   * Material grade or alloy type (e.g., "медь", "алюминий").
   * Used for material identification and properties lookup.
   */
  @IsString()
  @IsOptional()
  alloy?: string
  /**
   * Width of the sheet in millimeters (mm).
   * Optional dimension that can be used for specific sheet sizes.
   */
  @IsNumber()
  @Min(0)
  @IsOptional()
  width?: number
  deriveLabel(): string {
    if (Number.isNaN(this.thickness) || this.thickness == null) {
      throw new Error('g is not specified')
    }
    return `${this.shapeUI} ${this.thickness}${
      this.width ? `x${this.width}` : ''
    }`
  }
}

export class Pipe extends Material {
  unit = EnUnit.Kg
  shape = EnMaterialShape.Pipe
  /**
   * Outer diameter of the pipe in millimeters (mm).
   * This is the primary dimension used for identification and calculations.
   */
  @IsNumber()
  @Min(0)
  diameter!: number
  /**
   * Material grade or alloy type (e.g., "медь", "алюминий").
   * Used for material identification and properties lookup.
   */
  @IsString()
  alloy!: string
  /**
   * Wall thickness of the pipe in millimeters (mm).
   * Used together with diameter to calculate cross-sectional area and mass.
   */
  @IsNumber()
  @Min(0)
  thickness!: number
  deriveLabel(): string {
    if (isNaN(this.diameter)) {
      throw new Error('diameter is NaN')
    }
    return `${this.shapeUI} ${this.diameter} ${this.alloy}`.trim()
  }
}

export class SquareBar extends Material {
  unit = EnUnit.Kg
  shape = EnMaterialShape.SquareBar
  /**
   * Side length of the square bar in millimeters (mm).
   * This is the primary dimension used for identification and calculations.
   */
  @IsNumber()
  @Min(0)
  length!: number
  /**
   * Material grade or alloy type (e.g., "медь", "алюминий").
   * Used for material identification and properties lookup.
   */
  @IsString()
  alloy!: string
  deriveLabel(): string {
    if (!this.length) {
      throw new Error('length is not specified')
    }
    return `${this.shapeUI} ${this.length} ${this.alloy || ''}`.trim()
  }
}

export const MaterialConstructorMap = {
  [EnMaterialShape.RoundBar]: RoundBar,
  [EnMaterialShape.List]: List,
  [EnMaterialShape.Pipe]: Pipe,
  [EnMaterialShape.SquareBar]: SquareBar
}

export function getMaterialConstructor<T extends EnMaterialShape>(
  shape: T
): (typeof MaterialConstructorMap)[T] {
  const c = MaterialConstructorMap[shape]
  if (!c) {
    throw new Error(`Material constructor for shape ${shape} not found`)
  }
  return c
}

import { plainToInstance } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { EnMaterialShape, EnUnit } from './enums'
import {
  GenericShapeData,
  ListShapeData,
  PipeShapeData,
  RoundBarShapeData,
  SquareBarShapeData
} from './material-shape'
import { uiMaterialShape, uiUnit } from './ui.translators'

interface ResourceNameProps {
  name: string
  caption?: string
  flags?: Flag[]
}

interface Flag {
  color: number
  text: string
}

export abstract class Material<
  ShapeData extends GenericShapeData = GenericShapeData
> {
  @IsNumber()
  readonly id: number
  label: string

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
  abstract getLabelProps(): ResourceNameProps

  abstract load(id: number | null, shapeData: ShapeData): this
  abstract shapeData(): ShapeData
}

export class RoundBar extends Material<RoundBarShapeData> {
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

    return `${this.shapeUI} D${this.diameter} ${this.alloy}`
  }
  getLabelProps(): ResourceNameProps {
    return {
      name: `${this.shapeUI} D${this.diameter}`,
      caption: this.alloy,
      flags: [
        {
          color: 1,
          text: this.calibrated ? 'Калиброван' : ''
        }
      ]
    }
  }
  load(id: number | null, shapeData: RoundBarShapeData): this {
    return plainToInstance(RoundBar, {
      id,
      alloy: shapeData.alloy,
      calibrated: shapeData.calibrated || false,
      diameter: shapeData.diameter,
      density: shapeData.density || 0,
      linearMass: shapeData.linearMass || 0
    }) as this
  }
  shapeData(): RoundBarShapeData {
    return {
      alloy: this.alloy,
      calibrated: this.calibrated || false,
      density: this.density,
      diameter: this.diameter
    }
  }
}

export class List extends Material<ListShapeData> {
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
    return `${this.shapeUI} G${this.thickness}${
      this.width ? `x${this.width}` : ''
    }`
  }
  getLabelProps(): ResourceNameProps {
    return {
      name: `${this.shapeUI} G${this.thickness}${
        this.width ? `x${this.width}` : ''
      }`
    }
  }
  load(id: number | null, shapeData: ListShapeData): this {
    return plainToInstance(List, {
      id,
      alloy: shapeData.alloy,
      thickness: shapeData.thickness,
      width: shapeData.width
    }) as this
  }
  shapeData(): ListShapeData {
    return {
      alloy: this.alloy || '',
      thickness: this.thickness,
      width: this.width
    }
  }
}

export class Pipe extends Material<PipeShapeData> {
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
    if (Number.isNaN(this.diameter)) {
      throw new Error('diameter is not specified')
    }
    return `${this.shapeUI} D${this.diameter} ${this.alloy}`
  }
  getLabelProps(): ResourceNameProps {
    return {
      name: this.deriveLabel(),
      caption: this.alloy
    }
  }
  load(id: number | null, shapeData: PipeShapeData): this {
    return plainToInstance(Pipe, {
      id,
      alloy: shapeData.alloy,
      diameter: shapeData.diameter,
      thickness: shapeData.thickness
    }) as this
  }
  shapeData(): PipeShapeData {
    return {
      alloy: this.alloy,
      diameter: this.diameter,
      thickness: this.thickness
    }
  }
}

export class SquareBar extends Material<SquareBarShapeData> {
  unit = EnUnit.Kg
  shape = EnMaterialShape.SquareBar

  @IsString()
  name = 'Квадрат'
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

    return `${this.name} ${this.length}x${this.alloy}`
  }
  getLabelProps(): ResourceNameProps {
    return {
      name: this.name,
      caption: this.alloy
    }
  }
  load(id: number | null, shapeData: SquareBarShapeData): this {
    return plainToInstance(SquareBar, {
      id,
      alloy: shapeData.alloy,
      length: shapeData.length
    }) as this
  }
  shapeData(): SquareBarShapeData {
    return {
      alloy: this.alloy,
      length: this.length
    }
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

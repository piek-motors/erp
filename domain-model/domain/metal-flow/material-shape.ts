import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { EnMaterialShape } from './enums'
import { ClassConstructor } from 'class-transformer'

class Common {
  @IsString()
  alloy!: string
}

export type GenericShapeData = Common

export class RoundBarShapeData extends Common {
  @IsNumber()
  diameter!: number

  @IsBoolean()
  calibrated!: boolean

  @IsNumber()
  density?: number
  linearMass?: number
}

export class ListShapeData extends Common {
  @IsNumber()
  thickness!: number

  @IsNumber()
  @IsOptional()
  width?: number
}

export class PipeShapeData extends Common {
  @IsNumber()
  diameter!: number

  @IsNumber()
  thickness!: number
}

export class SquareBarShapeData extends Common {
  @IsNumber()
  length!: number

  @IsNumber()
  @IsOptional()
  width?: number
}

const ShapeDataConstructorMap = {
  [EnMaterialShape.RoundBar]: RoundBarShapeData,
  [EnMaterialShape.List]: ListShapeData,
  [EnMaterialShape.Pipe]: PipeShapeData,
  [EnMaterialShape.SquareBar]: SquareBarShapeData
}

export type ShapeDataUnion =
  | RoundBarShapeData
  | SquareBarShapeData
  | ListShapeData
  | PipeShapeData

export function getShapeDataConstructor(
  shape: EnMaterialShape
): ClassConstructor<ShapeDataUnion> {
  const c = ShapeDataConstructorMap[shape]
  if (!c) {
    throw new Error(`Shape data constructor for shape ${shape} not found`)
  }
  return c
}

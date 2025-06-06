import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { EnMaterialShape } from '../metal-flow/enums'

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
}

type ShapeDataFactory =
  | typeof RoundBarShapeData
  | typeof ListShapeData
  | typeof PipeShapeData
  | typeof SquareBarShapeData

export function getShapeDataFactory(shape: EnMaterialShape): ShapeDataFactory {
  switch (shape) {
    case EnMaterialShape.RoundBar:
      return RoundBarShapeData
    case EnMaterialShape.List:
      return ListShapeData
    case EnMaterialShape.Pipe:
      return PipeShapeData
    case EnMaterialShape.SquareBar:
      return SquareBarShapeData
    default:
      throw new Error(`Unknown shape: ${shape}`)
  }
}

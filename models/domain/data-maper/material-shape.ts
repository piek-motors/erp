import { IsBoolean, IsNumber, IsOptional } from 'class-validator'
import { EnMaterialShape } from '../metal-flow/enums'

export class RoundBarShapeData {
  @IsNumber()
  diameter!: number
  @IsBoolean()
  calibrated!: boolean
  @IsNumber()
  density?: number
}

export class ListShapeData {
  @IsNumber()
  thickness!: number
  @IsNumber()
  @IsOptional()
  width?: number
}

export class PipeShapeData {
  @IsNumber()
  diameter!: number
  @IsNumber()
  thickness!: number
}

export class HexagonBarShapeData {
  @IsNumber()
  diameter!: number
}

export class SquareBarShapeData {
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

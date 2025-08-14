import { EnMaterialShape } from '../metal-flow/enums'

export class RoundBarShapeData {
  diameter!: number
  calibrated!: boolean
  density?: number
}

export class ListShapeData {
  thickness!: number
  width?: number
}

export class PipeShapeData {
  diameter!: number
  thickness!: number
}

export class HexagonBarShapeData {
  diameter!: number
}

export class SquareBarShapeData {
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

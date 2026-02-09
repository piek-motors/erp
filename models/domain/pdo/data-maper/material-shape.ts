import { MaterialShape } from '../enums.js'

export class RoundBarShapeData {
  diameter!: number
  calibrated!: boolean
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

export class ArbitraryShapeData {
  name!: string
}

type ShapeDataFactory =
  | typeof RoundBarShapeData
  | typeof ListShapeData
  | typeof PipeShapeData
  | typeof SquareBarShapeData
  | typeof ArbitraryShapeData

export function getShapeDataFactory(shape: MaterialShape): ShapeDataFactory {
  switch (shape) {
    case MaterialShape.RoundBar:
      return RoundBarShapeData
    case MaterialShape.List:
      return ListShapeData
    case MaterialShape.Pipe:
      return PipeShapeData
    case MaterialShape.SquareBar:
      return SquareBarShapeData
    case MaterialShape.Arbitrary:
      return ArbitraryShapeData
    default:
      throw new Error(`Unknown shape: ${shape}`)
  }
}

import {
  Arbitrary,
  HexagonBar,
  List,
  type Material,
  Pipe,
  RoundBar,
  SquareBar,
} from '../materials'
import type {
  ArbitraryShapeData,
  HexagonBarShapeData,
  ListShapeData,
  PipeShapeData,
  RoundBarShapeData,
  SquareBarShapeData,
} from './material-shape'

export class MaterialShapeAbstractionLayer {
  static exportShapeData(
    material: Material,
  ):
    | RoundBarShapeData
    | ListShapeData
    | PipeShapeData
    | SquareBarShapeData
    | HexagonBarShapeData
    | ArbitraryShapeData {
    if (material instanceof RoundBar) {
      return {
        diameter: material.diameter,
        calibrated: material.calibrated,
      } satisfies RoundBarShapeData
    } else if (material instanceof List) {
      return {
        thickness: material.thickness,
        width: material.width || 0,
      } satisfies ListShapeData
    } else if (material instanceof Pipe) {
      return {
        diameter: material.diameter,
        thickness: material.thickness,
      } satisfies PipeShapeData
    } else if (material instanceof SquareBar) {
      return {
        length: material.length,
      } satisfies SquareBarShapeData
    } else if (material instanceof HexagonBar) {
      return {
        diameter: material.diameter,
      } satisfies HexagonBarShapeData
    } else if (material instanceof Arbitrary) {
      return {
        name: material.name,
      } satisfies ArbitraryShapeData
    } else {
      throw new ErrNotImplemented()
    }
  }

  static importShapeData(material: Material, data: unknown): Material {
    if (material instanceof RoundBar) {
      const d = data as RoundBarShapeData

      material.diameter = d.diameter
      material.calibrated = d.calibrated

      return material
    } else if (material instanceof List) {
      const d = data as ListShapeData

      material.thickness = d.thickness
      material.width = d.width

      return material
    } else if (material instanceof Pipe) {
      const d = data as PipeShapeData

      material.diameter = d.diameter
      material.thickness = d.thickness

      return material
    } else if (material instanceof SquareBar) {
      const d = data as SquareBarShapeData

      material.length = d.length

      return material
    } else if (material instanceof HexagonBar) {
      const d = data as HexagonBarShapeData

      material.diameter = d.diameter

      return material
    } else if (material instanceof Arbitrary) {
      const d = data as ArbitraryShapeData

      material.name = d.name

      return material
    } else {
      throw new ErrNotImplemented()
    }
  }
}

class ErrNotImplemented extends Error {
  constructor() {
    super('Shape data import not implemented')
  }
}

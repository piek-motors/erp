import {
  List,
  Material,
  Pipe,
  RoundBar,
  SquareBar
} from '../metal-flow/materials'
import {
  ListShapeData,
  PipeShapeData,
  RoundBarShapeData,
  SquareBarShapeData
} from './material-shape'

export class MaterialShapeAbstractionLayer {
  static exportShapeData(
    material: Material
  ): RoundBarShapeData | ListShapeData | PipeShapeData | SquareBarShapeData {
    if (material instanceof RoundBar) {
      return {
        diameter: material.diameter,
        calibrated: material.calibrated,
        density: material.density
      } satisfies RoundBarShapeData
    } else if (material instanceof List) {
      return {
        thickness: material.thickness,
        width: material.width || 0
      } satisfies ListShapeData
    } else if (material instanceof Pipe) {
      return {
        diameter: material.diameter,
        thickness: material.thickness
      } satisfies PipeShapeData
    } else if (material instanceof SquareBar) {
      return {
        length: material.length
      } satisfies SquareBarShapeData
    } else {
      throw new ErrNotImplemented()
    }
  }

  static importShapeData(material: Material, data: unknown): Material {
    if (material instanceof RoundBar) {
      const d = data as RoundBarShapeData

      material.diameter = d.diameter
      material.calibrated = d.calibrated
      material.density = d.density || 0

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

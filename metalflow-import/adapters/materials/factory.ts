import {
  EnMaterialShape,
  List,
  ListShapeData,
  Pipe,
  PipeShapeData,
  RoundBar,
  RoundBarShapeData,
  SquareBar,
  SquareBarShapeData,
  type Material
} from 'domain-model'
import type { DB } from '../../../db/schema.js'

export interface IMaterialFactory {
  createFromShapeData(shapeData: object): Material
  createFromDB(data: DB.Material): Material
}

export class MaterialFactory {
  static create(shape: EnMaterialShape): IMaterialFactory {
    switch (shape) {
      case EnMaterialShape.RoundBar:
        return new RoundBarFactory()
      case EnMaterialShape.SquareBar:
        return new SquareBarFactory()
      case EnMaterialShape.Pipe:
        return new PipeFactory()
      case EnMaterialShape.List:
        return new ListFactory()
      default:
        throw new Error(`Unknown material shape: ${shape}`)
    }
  }
}

export class ListFactory implements IMaterialFactory {
  createFromShapeData(shapeData: ListShapeData): Material {
    const m = new List(null)
    m.thickness = shapeData.thickness
    if (shapeData.alloy) m.alloy = shapeData.alloy
    if (shapeData.width) m.width = shapeData.width
    return m
  }

  createFromDB(data: DB.Material): Material {
    const m = new List(data.id)
    m.thickness = data.shape_data.thickness
    if (data.shape_data.alloy) m.alloy = data.shape_data.alloy
    if (data.shape_data.width) m.width = data.shape_data.width
    return m
  }
}

export class PipeFactory implements IMaterialFactory {
  createFromShapeData(shapeData: PipeShapeData): Material {
    const m = new Pipe(null)
    m.diameter = shapeData.diameter
    m.alloy = shapeData.alloy
    m.thickness = shapeData.thickness
    return m
  }

  createFromDB(data: DB.Material): Material {
    const material = new Pipe(data.id)
    material.diameter = data.shape_data.diameter
    material.alloy = data.shape_data.alloy
    material.thickness = data.shape_data.thickness
    return material
  }
}

export class RoundBarFactory implements IMaterialFactory {
  createFromShapeData(shapeData: RoundBarShapeData): Material {
    const m = new RoundBar(null)
    m.diameter = shapeData.diameter
    m.alloy = shapeData.alloy
    m.calibrated = shapeData.calibrated
    if (shapeData.density) m.density = shapeData.density
    if (shapeData.linearMass) m.linearMass = shapeData.linearMass
    return m
  }

  createFromDB(data: DB.Material): Material {
    const material = new RoundBar(data.id)
    material.diameter = data.shape_data.diameter
    material.alloy = data.shape_data.alloy
    material.calibrated = data.shape_data.calibrated
    if (data.shape_data.density) material.density = data.shape_data.density
    if (data.shape_data.linearMass)
      material.linearMass = data.shape_data.linearMass
    return material
  }
}

export class SquareBarFactory implements IMaterialFactory {
  createFromShapeData(shapeData: SquareBarShapeData): Material {
    const m = new SquareBar(null)
    m.length = shapeData.length
    m.alloy = shapeData.alloy
    return m
  }

  createFromDB(data: DB.Material): Material {
    const m = new SquareBar(data.id)
    m.length = data.shape_data.length
    m.alloy = data.shape_data.alloy
    return m
  }
}

import { DB } from 'db'
import * as dm from 'domain-model'

export interface IMaterialFactory {
  createFromShapeData(shapeData: object): dm.Material
  createFromDB(data: DB.Material): dm.Material
}

export class MaterialFactory {
  static create(shape: dm.EnMaterialShape): IMaterialFactory {
    switch (shape) {
      case dm.EnMaterialShape.RoundBar:
        return new RoundBarFactory()
      case dm.EnMaterialShape.SquareBar:
        return new SquareBarFactory()
      case dm.EnMaterialShape.Pipe:
        return new PipeFactory()
      case dm.EnMaterialShape.List:
        return new ListFactory()
      default:
        throw new Error(`Unknown material shape: ${shape}`)
    }
  }
}

export class ListFactory implements IMaterialFactory {
  createFromShapeData(shapeData: dm.ListShapeData): dm.Material {
    const m = new dm.List(0)
    m.thickness = shapeData.thickness
    if (shapeData.alloy) m.alloy = shapeData.alloy
    if (shapeData.width) m.width = shapeData.width
    return m
  }

  createFromDB(data: DB.Material): dm.Material {
    const m = new dm.List(data.id)
    m.thickness = data.shape_data.thickness
    if (data.shape_data.alloy) m.alloy = data.shape_data.alloy
    if (data.shape_data.width) m.width = data.shape_data.width
    return m
  }
}

export class PipeFactory implements IMaterialFactory {
  createFromShapeData(shapeData: dm.PipeShapeData): dm.Material {
    const m = new dm.Pipe(0)
    m.diameter = shapeData.diameter
    m.alloy = shapeData.alloy
    m.thickness = shapeData.thickness
    return m
  }

  createFromDB(data: DB.Material): dm.Material {
    const material = new dm.Pipe(data.id)
    material.diameter = data.shape_data.diameter
    material.alloy = data.shape_data.alloy
    material.thickness = data.shape_data.thickness
    return material
  }
}

export class RoundBarFactory implements IMaterialFactory {
  createFromShapeData(shapeData: dm.RoundBarShapeData): dm.Material {
    const m = new dm.RoundBar(0)
    m.diameter = shapeData.diameter
    m.alloy = shapeData.alloy
    m.calibrated = shapeData.calibrated
    if (shapeData.density) m.density = shapeData.density
    if (shapeData.linearMass) m.linearMass = shapeData.linearMass
    return m
  }

  createFromDB(data: DB.Material): dm.Material {
    const material = new dm.RoundBar(data.id)
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
  createFromShapeData(shapeData: dm.SquareBarShapeData): dm.Material {
    const m = new dm.SquareBar(0)
    m.length = shapeData.length
    m.alloy = shapeData.alloy
    return m
  }

  createFromDB(data: DB.Material): dm.Material {
    const m = new dm.SquareBar(data.id)
    m.length = data.shape_data.length
    m.alloy = data.shape_data.alloy
    return m
  }
}

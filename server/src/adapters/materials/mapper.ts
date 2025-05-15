import { plainToInstance } from 'class-transformer'
import type { Generated } from 'kysely'
import {
  EnMaterialShape,
  List,
  ListShapeData,
  Material,
  Pipe,
  PipeShapeData,
  RoundBar,
  RoundBarShapeData,
  SquareBar,
  SquareBarShapeData
} from 'domain-model'
import type { DB } from '../../db/schema.ts'
import { extractShapeData } from './guards.ts'

export class MaterialMapper {
  toPersistence(material: Material): DB.MaterialTable {
    return {
      id: material.id as unknown as Generated<number>,
      unit: material.unit,
      shape: material.shape,
      shape_data: extractShapeData(
        material
      ) as unknown as DB.MaterialTable['shape_data']
    }
  }

  fromPersistence(data: DB.MaterialTable): Material {
    const raw = data.shape_data
    switch (data.shape) {
      case EnMaterialShape.RoundBar:
        return this.createRoundBar(
          data.id,
          plainToInstance(RoundBarShapeData, raw)
        )
      case EnMaterialShape.List:
        return this.createList(data.id, plainToInstance(ListShapeData, raw))
      case EnMaterialShape.Pipe:
        return this.createPipe(data.id, plainToInstance(PipeShapeData, raw))
      case EnMaterialShape.SquareBar:
        return this.createSquareBar(
          data.id,
          plainToInstance(SquareBarShapeData, raw)
        )
      default:
        throw new Error(`Unsupported material shape: ${data.shape}`)
    }
  }

  createRoundBar(id: Generated<number>, data: RoundBarShapeData): Material {
    const material = new RoundBar(Number(id))
    material.diameter = data.diameter
    material.alloy = data.alloy
    material.calibrated = data.calibrated
    if (data.density) material.density = data.density
    if (data.linearMass) material.linearMass = data.linearMass
    return material
  }

  createList(id: Generated<number>, data: ListShapeData): Material {
    const material = new List(Number(id))
    material.thickness = data.thickness
    material.alloy = data.alloy
    if (data.width) material.width = data.width
    return material
  }

  createPipe(id: Generated<number>, data: PipeShapeData): Material {
    const material = new Pipe(Number(id))
    material.diameter = data.diameter
    material.alloy = data.alloy
    material.thickness = data.thickness
    return material
  }

  createSquareBar(id: Generated<number>, data: SquareBarShapeData): Material {
    const material = new SquareBar(Number(id))
    material.length = data.length
    material.alloy = data.alloy
    return material
  }
}

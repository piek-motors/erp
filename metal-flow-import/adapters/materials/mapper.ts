import { plainToInstance } from 'class-transformer'
import { DB } from 'db'
import * as dm from 'domain-model'
import type { Generated } from 'kysely'
import { extractShapeData } from './guards'

export class MaterialMapper {
  toPersistence(material: dm.Material): DB.MaterialTable {
    return {
      id: material.id as unknown as Generated<number>,
      unit: material.unit,
      shape: material.shape,
      shape_data: extractShapeData(
        material
      ) as unknown as DB.MaterialTable['shape_data'],
      label: material.label
    }
  }

  fromPersistence(data: DB.MaterialTable): dm.Material {
    const raw = data.shape_data
    switch (data.shape) {
      case dm.EnMaterialShape.RoundBar:
        return this.createRoundBar(
          data.id,
          plainToInstance(dm.RoundBarShapeData, raw)
        )
      case dm.EnMaterialShape.List:
        return this.createList(data.id, plainToInstance(dm.ListShapeData, raw))
      case dm.EnMaterialShape.Pipe:
        return this.createPipe(data.id, plainToInstance(dm.PipeShapeData, raw))
      case dm.EnMaterialShape.SquareBar:
        return this.createSquareBar(
          data.id,
          plainToInstance(dm.SquareBarShapeData, raw)
        )
      default:
        throw new Error(`Unsupported material shape: ${data.shape}`)
    }
  }

  createRoundBar(
    id: Generated<number>,
    data: dm.RoundBarShapeData
  ): dm.Material {
    const material = new dm.RoundBar(Number(id))
    material.diameter = data.diameter
    material.alloy = data.alloy
    material.calibrated = data.calibrated
    if (data.density) material.density = data.density
    if (data.linearMass) material.linearMass = data.linearMass
    return material
  }

  createList(id: Generated<number>, data: dm.ListShapeData): dm.Material {
    const material = new dm.List(Number(id))
    material.thickness = data.thickness
    material.alloy = data.alloy
    if (data.width) material.width = data.width
    return material
  }

  createPipe(id: Generated<number>, data: dm.PipeShapeData): dm.Material {
    const material = new dm.Pipe(Number(id))
    material.diameter = data.diameter
    material.alloy = data.alloy
    material.thickness = data.thickness
    return material
  }

  createSquareBar(
    id: Generated<number>,
    data: dm.SquareBarShapeData
  ): dm.Material {
    const material = new dm.SquareBar(Number(id))
    material.length = data.length
    material.alloy = data.alloy
    return material
  }
}

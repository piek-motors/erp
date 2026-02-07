import {
  getMaterialConstructor,
  type Material,
  MaterialShapeAbstractionLayer,
} from 'models'
import type { RouterOutput } from '@/server/lib/trpc'

type GetMaterialsOutput = RouterOutput['pdo']['material']['get']['material']

class MaterialMapper {
  from_dto(material: GetMaterialsOutput): Material {
    if (material == null) throw new Error('material mapper: empty dto passed')
    if (material.shape == null)
      throw new Error('material mapper: shape is not specified')

    const MaterialConstructor = getMaterialConstructor<any>(material.shape)
    if (!MaterialConstructor)
      throw new Error('material mapper: material constructor not found')

    const m = new MaterialConstructor(material.id, material.label)
    m.linearMass = material.linear_mass
    MaterialShapeAbstractionLayer.importShapeData(m, material.shape_data)
    m.stock = material.on_hand_balance

    return m
  }
}

export const map = {
  material: new MaterialMapper(),
}

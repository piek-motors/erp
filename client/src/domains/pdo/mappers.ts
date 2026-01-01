import {
  getMaterialConstructor,
  Material,
  MaterialShapeAbstractionLayer
} from 'models'
import { RouterOutput } from 'srv/lib/trpc'
import { Material as MaterialListDto } from 'srv/rpc/pdo/materials'

type GetMaterialsOutput = RouterOutput['pdo']['material']['get']

class MaterialMapper {
  fromDto(dto: GetMaterialsOutput): Material {
    if (dto == null) throw new Error('material mapper: empty dto passed')
    if (dto.material.shape == null)
      throw new Error('material mapper: shape is not specified')

    const MaterialConstructor = getMaterialConstructor<any>(dto.material.shape)
    if (!MaterialConstructor)
      throw new Error('material mapper: material constructor not found')

    const emptyMaterial = new MaterialConstructor(
      dto.material.id,
      dto.material.label
    )
    emptyMaterial.linearMass = dto.material.linear_mass
    MaterialShapeAbstractionLayer.importShapeData(
      emptyMaterial,
      dto.material.shape_data
    )
    emptyMaterial.stock = dto.material.stock

    return emptyMaterial
  }

  listFromDto(dto: MaterialListDto): Material {
    if (dto == null) throw new Error('material mapper: empty dto passed')
    if (dto.shape == null)
      throw new Error('material mapper: shape is not specified')

    const MaterialConstructor = getMaterialConstructor<any>(dto.shape)
    if (!MaterialConstructor)
      throw new Error('material mapper: material constructor not found')

    const emptyMaterial = new MaterialConstructor(dto.id, dto.label)
    MaterialShapeAbstractionLayer.importShapeData(emptyMaterial, dto.shape_data)
    emptyMaterial.remainingStock = dto.stock
    return emptyMaterial
  }
}

export const map = {
  material: new MaterialMapper()
}

import {
  Detail,
  getMaterialConstructor,
  Material,
  MaterialShapeAbstractionLayer
} from 'domain-model'

// @ts-ignore
import { RouterOutput } from '../../../server/src/lib/trpc'
type GetMaterialsOutput = RouterOutput['material']['get']
type GetMaterialsListOutput = RouterOutput['material']['list'][number]

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

  listFromDto(dto: GetMaterialsListOutput): Material {
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

class DetailMapper {
  private materialMapper = new MaterialMapper()

  fromDto(raw: any): Detail | null {
    if (!raw) return null
    const detail = new Detail({
      id: raw.id,
      name: raw.name,
      partCode: raw.part_code ?? null
    })

    for (const each of raw.detail_materials) {
      const material = this.materialMapper.fromDto(each.material)
      detail.madeOf(material, each.data?.length, each.data?.weight)
    }

    return detail
  }
}

export const map = {
  material: new MaterialMapper(),
  detail: new DetailMapper()
}

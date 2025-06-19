import {
  Detail,
  getMaterialConstructor,
  Material,
  MaterialShapeAbstractionLayer
} from 'domain-model'
import {
  GetDetailByPkQuery,
  GetMaterialByPkQuery
} from 'lib/types/graphql-shema'

class MaterialMapper {
  fromDto(dto: GetMaterialByPkQuery['metal_flow_materials_by_pk']): Material {
    if (dto == null) throw new Error('material mapper: empty dto passed')
    if (dto.shape == null)
      throw new Error('material mapper: shape is not specified')

    const MaterialConstructor = getMaterialConstructor<any>(dto.shape)
    if (!MaterialConstructor)
      throw new Error('material mapper: material constructor not found')

    const emptyMaterial = new MaterialConstructor(dto.id, dto.label)
    MaterialShapeAbstractionLayer.importShapeData(emptyMaterial, dto.shape_data)

    return emptyMaterial
  }

  convertable(
    dto: GetMaterialByPkQuery['metal_flow_materials_by_pk']
  ): boolean {
    try {
      this.fromDto(dto)
      return true
    } catch (e) {
      return false
    }
  }
}

class DetailMapper {
  private materialMapper = new MaterialMapper()

  fromDto(raw: GetDetailByPkQuery['metal_flow_details_by_pk']): Detail | null {
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

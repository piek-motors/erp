import { plainToInstance } from 'class-transformer'
import {
  Detail,
  getMaterialConstructor,
  getShapeDataConstructor,
  Material
} from 'domain-model'
import { GetDetailByPkQuery, GetMaterialByPkQuery } from 'types/graphql-shema'

class MaterialMapper {
  fromDto(dto: GetMaterialByPkQuery['metal_flow_materials_by_pk']): Material {
    if (dto == null) {
      throw new Error('material mapper: empty dto passed')
    }
    if (dto.shape == null) {
      throw new Error('material mapper: shape is not specified')
    }

    const shapeDataConstructor = getShapeDataConstructor(dto.shape)
    const shapeData = plainToInstance(shapeDataConstructor, dto.shape_data)
    const MaterialConstructor = getMaterialConstructor<any>(dto.shape)
    if (!MaterialConstructor) {
      throw new Error('material mapper: material constructor not found')
    }

    const material = new MaterialConstructor(dto.id)
    return material.load(dto.id, shapeData)
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
    const detailMaterials = new Map<
      Material,
      { weight: number; length: number }
    >()

    for (const each of raw.detail_materials) {
      const material = this.materialMapper.fromDto(each.material)
      const relationData = {
        weight: each?.data?.weight || 0,
        length: each?.data?.length || 0
      }
      detailMaterials.set(material, relationData)
    }

    return new Detail(raw.id, raw.name, detailMaterials)
  }
}

export const map = {
  material: new MaterialMapper(),
  detail: new DetailMapper()
}

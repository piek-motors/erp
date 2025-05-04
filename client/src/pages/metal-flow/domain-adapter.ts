import { plainToInstance } from 'class-transformer';
import { getShapeDataConstructor } from 'shared';
import { Detail, Material } from 'shared/domain';
import { GetDetailByPkQuery, GetMaterialByPkQuery } from 'src/types/graphql-shema';

class MaterialMapper {
  fromDto(dto: GetMaterialByPkQuery['metal_pdo_materials_by_pk']): Material {
    if (dto == null) {
      throw new Error('material mapper: empty dto passed')
    }
    if (dto.shape == null) {
      throw new Error('material mapper: shape is not specified')
    }

    const shapeDataConstructor = getShapeDataConstructor(dto.shape)
    if (shapeDataConstructor == null) {
      throw new Error(`material mapper: unknown shape ${dto.shape}`)
    }

    const instance = plainToInstance(shapeDataConstructor, dto.shape_data) as any
    return new Material(dto.id, dto.unit, dto.shape, instance)
  }

  convertable(dto: GetMaterialByPkQuery['metal_pdo_materials_by_pk']): boolean {
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

  fromDto(raw: GetDetailByPkQuery['metal_pdo_details_by_pk']): Detail {
    if (!raw) {
      throw new Error('detail mapper: empty dto passed')
    }

    return new Detail(
      raw.id, raw.name, raw.detail_materials.map(material => this.materialMapper.fromDto(material.material))
    )
  }
}

export const map = {
  material: new MaterialMapper(),
  detail: new DetailMapper()
}


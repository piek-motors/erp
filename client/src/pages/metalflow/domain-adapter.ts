import { plainToClass } from 'class-transformer';
import { MaterialShapeDataConstructor } from 'shared';
import { Detail, Material } from 'shared/domain';
import { GetDetailByPkQuery, GetMaterialByPkQuery } from 'src/types/graphql-shema';

class MaterialMapper {
  fromDto(dto: GetMaterialByPkQuery['metal_pdo_materials_by_pk']): Material {
    if (!dto) {
      throw new Error('detail mapper: empty dto passed')
    }
    const shapeDataConstructor = MaterialShapeDataConstructor[dto.shape as 0]
    if (!shapeDataConstructor) {
      throw new Error(`detail mapper: unknown shape ${dto.shape}`)
    }

    const instance = plainToClass(shapeDataConstructor, dto.shape_data)
    return new Material(dto.id, dto.unit, dto.shape, instance)
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


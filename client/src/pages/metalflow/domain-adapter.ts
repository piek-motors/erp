import { Detail, Material } from 'shared/domain';
import { GetDetailByPkQuery } from 'src/types/graphql-shema';

class MaterialMapper {
  fromDto(dto: any): Material {
    return new Material(dto.id, dto.unit, dto.shape, dto.shape_data)
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


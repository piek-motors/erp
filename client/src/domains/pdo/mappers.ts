import {
  getMaterialConstructor,
  Material,
  MaterialShapeAbstractionLayer,
  Unit
} from 'models'
import { RouterOutput } from 'srv/lib/trpc'
import { SelectableDetail } from 'srv/rpc/pdo/details'
import { Material as MaterialListDto } from 'srv/rpc/pdo/materials'
import { DetailState } from './detail/detail.state'

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

class DetailMapper {
  fromDto(detail: Partial<SelectableDetail>): DetailState {
    const res = new DetailState()

    res.init({
      id: detail.id ?? 0,
      name: detail.name ?? '',
      part_code: detail.part_code ?? null,
      logical_group_id: detail.logical_group_id ?? null,
      stock: detail.stock || 0,
      description: detail.description || '',
      drawing_name: detail.drawing_name ?? '',
      updated_at: detail.updated_at?.toString() ?? '',
      blank_spec: detail.blank_spec,
      recommended_batch_size: detail.recommended_batch_size ?? null,
      processing_route: detail.processing_route ?? null,
      automatic_writeoff: detail.automatic_writeoff ?? null,
      unit: detail.unit ?? Unit.Countable,
      stock_location: detail.stock_location ?? null
    })
    return res
  }
}

export const map = {
  material: new MaterialMapper(),
  detail: new DetailMapper()
}

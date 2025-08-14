import {
  getMaterialConstructor,
  Material,
  MaterialShapeAbstractionLayer
} from 'models'

// @ts-ignore
import { RouterOutput } from 'srv/lib/trpc'
import { SelectableDetail } from 'srv/procedures/metalflow/detail/get'
import { ListMaterialsOutput as MaterialListDto } from 'srv/procedures/metalflow/material/list'
import { DetailCost, MaterialCost } from './details/cost.store'
import { Detail } from './details/store'
type GetMaterialsOutput = RouterOutput['metal']['material']['get']

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
  fromDto(detail: Partial<SelectableDetail>): Detail {
    return new Detail({
      id: detail.id,
      name: detail.name,
      partCode: detail.part_code,
      groupId: detail.logical_group_id,
      stock: detail.stock,
      description: detail.description,
      drawingName: detail.drawing_name,
      updatedAt: detail.updated_at && new Date(detail.updated_at),
      technicalParameters: detail.params,
      processingRoute: detail.processing_route,
      usedDetails: detail.automatic_writeoff?.details.map(
        d => new DetailCost(d)
      ),
      usedMaterials: detail.automatic_writeoff?.materials.map(
        m => new MaterialCost(m)
      )
    })
  }
}

export const map = {
  material: new MaterialMapper(),
  detail: new DetailMapper()
}

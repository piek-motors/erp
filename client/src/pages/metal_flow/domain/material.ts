import {
  CircleShapeData,
  MaterialShape,
  formatMaterialShape,
  formatUnit
} from 'shared'
import { EnMaterialShape, EnUnit } from 'shared/enumerations'
import { GetMaterialsQuery } from 'src/types/graphql-shema'

export class Material {
  length?: number
  weight?: number

  constructor(
    readonly id: number,
    readonly unitId: EnUnit,
    readonly shapeId: EnMaterialShape,
    readonly shapeData: MaterialShape,
    readonly name: string | null = null
  ) { }

  getIdentifier() {
    if (this.shapeId == EnMaterialShape.Circle) {
      const d = this.shapeData as any as CircleShapeData
      return `${this.shape()} D${d.diameter} ${d.alloy}`
    } else {
      return `${this.shape()} ${this.name}`
    }
  }

  // TODO: extract into adapters layer
  static fromDto(dto: GetMaterialsQuery['metal_pdo_materials'][0]) {
    return new Material(dto.id, dto.unit, dto.shape, dto.shape_data)
  }

  unit() {
    return formatUnit(this.unitId)
  }

  shape() {
    return formatMaterialShape(this.shapeId)
  }
}

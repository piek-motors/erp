import { EnMaterialShape, EnUnit } from '../enumerations'
import { formatMaterialShape, formatUnit } from '../enums.ui'
import { CircleShapeData, MaterialShape } from '../json.types'


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

  unit() {
    return formatUnit(this.unitId)
  }

  shape() {
    return formatMaterialShape(this.shapeId)
  }
}

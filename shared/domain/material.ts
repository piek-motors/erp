import { EnMaterialShape, EnUnit } from '../enumerations'
import { formatMaterialShape, formatUnit } from '../enums.ui'
import { MaterialShapeData } from '../json.types'

type Flag = {
  color: number
  text: string
}

export interface DisplayResourceNameProps {
  name: string
  caption?: string
  flags?: Flag[]
}

export class Material {
  length?: number
  weight?: number

  constructor(
    readonly id: number,
    readonly unitId: EnUnit,
    readonly shapeId: EnMaterialShape,
    readonly shapeData: MaterialShapeData
  ) { }

  static create({ id, unitId, shapeId, shapeData }: Material) {
    return new Material(id, unitId, shapeId, shapeData)
  }

  getTextId() {
    return this.shapeData.getIdentifier()
  }

  resourceName(): DisplayResourceNameProps {
    return this.shapeData.getResourceNameProps()
  }

  unit() {
    return formatUnit(this.unitId)
  }

  shape() {
    return formatMaterialShape(this.shapeId)
  }
}

import { EnMaterialShape, EnUnit } from '../enumerations'
import { uiMaterialShape, uiUnit } from '../enums.ui'
import { MaterialShapeData } from '../shape-data'

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
  constructor(
    readonly id: number,
    readonly unitId: EnUnit,
    readonly shapeId: EnMaterialShape,
    readonly shapeData: MaterialShapeData
  ) {}

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
    return uiUnit(this.unitId)
  }

  shape() {
    return uiMaterialShape(this.shapeId)
  }
}

import { Material } from './materials'

export interface IDetailMaterialRelation {
  // length in mm
  length: number
  // weight in grams
  weight: number
}

type DetailInit = {
  id: number
  name: string
  partCode: string | null
}

export class Detail {
  id!: number
  name!: string
  /** Code of the part based on engineering documentation (e.g., drawing number) */
  partCode: string | null
  /** The materials from which this detail is made */
  readonly materials: Array<
    {
      material: Material
    } & IDetailMaterialRelation
  > = []

  constructor(init: DetailInit) {
    this.id = init.id
    this.name = init.name
    this.partCode = init.partCode
  }

  madeOf(material: Material, length: number, weight: number): Detail {
    this.materials.push({ material, length, weight })
    return this
  }
}

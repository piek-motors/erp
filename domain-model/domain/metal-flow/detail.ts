import { Material } from './materials'

export interface IDetailMaterialRelation {
  // length in mm
  length: number
  // weight in grams
  weight: number
}

export class Detail {
  /** The materials from which this detail is made */
  readonly materials: Array<
    {
      material: Material
    } & IDetailMaterialRelation
  > = []

  constructor(readonly id: number, readonly name: string) {}

  madeOf(material: Material, length: number, weight: number): Detail {
    this.materials.push({ material, length, weight })
    return this
  }
}

import { Material } from './materials'

export interface IDetailMaterialRelation {
  length: number
  weight: number
}

export class Detail {
  /** The materials from which this detail is made */
  readonly materials = new Map<Material, IDetailMaterialRelation>()

  constructor(readonly id: number, readonly name: string) {}

  madeOf(material: Material, length: number, weight: number): Detail {
    this.materials.set(material, { length, weight })
    return this
  }
}

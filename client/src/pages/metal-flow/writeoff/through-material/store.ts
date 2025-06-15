import { Material, WriteoffDirectUnit } from 'domain-model'
import { makeAutoObservable } from 'lib/deps'
import { IWriteoffType } from '../interfaces/writeoff-type'

export class WriteoffThroughMaterialStore implements IWriteoffType {
  material?: Material
  setMaterial(material: Material) {
    this.material = material
  }

  qty = 0
  setQty(qty: string) {
    const isNumber = Number.isFinite(Number(qty))
    this.qty = isNumber ? Number(qty) : 0
  }

  constructor() {
    makeAutoObservable(this)
  }

  getTypeData(): WriteoffDirectUnit {
    return {}
  }
}

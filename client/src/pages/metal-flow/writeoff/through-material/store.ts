import { Material, WriteoffDirectUnit } from 'domain-model'
import { makeAutoObservable } from 'lib/deps'
import { IWriteoffType } from '../interfaces/writeoff-type'

export class WriteoffThroughMaterialStore implements IWriteoffType {
  material?: Material
  setMaterial(material: Material) {
    this.material = material
  }

  weight = ''
  setWeight(weight: string) {
    this.weight = weight
  }

  constructor() {
    makeAutoObservable(this)
  }

  validate(): Error | undefined {
    const material = this.material?.id
    if (!material) {
      return new Error('Материал не выбран')
    }
    if (parseFloat(this.weight) === 0) {
      return new Error('Вес не указан')
    }
  }

  getTypeData(): WriteoffDirectUnit {
    return {}
  }
}

import { EnWriteoffReason, WriteoffDirectUnit } from 'domain-model'
import { makeAutoObservable, rpc } from 'lib/deps'
import { MaterialLiseOutput } from 'metalflow/material/store/material-list.store'
import { IWriteoffMethod } from '../interfaces/writeoff-type'

export class WriteoffThroughMaterialStore implements IWriteoffMethod {
  material?: MaterialLiseOutput
  setMaterial(material: MaterialLiseOutput) {
    this.material = material
  }

  weight = ''
  setWeight(weight: string) {
    this.weight = weight
  }

  dialogOpen = false
  setDialogOpen(v: boolean) {
    this.dialogOpen = v
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

  async save(reason: EnWriteoffReason): Promise<number[]> {
    const material = this.material
    if (!material) {
      throw new Error('Material is not set')
    }
    await rpc.material.writeoffTroughMaterial.mutate({
      material_id: material.id,
      qty: parseFloat(this.weight),
      reason,
      type_data: this.getTypeData()
    })
    return []
  }
}

import { EnWriteoffReason, WriteoffDirectUnit } from 'domain-model'
import { makeAutoObservable, rpc } from 'lib/deps'

export class MaterialWriteoffState {
  weight = ''
  setWeight(weight: string) {
    this.weight = weight
  }
  reason: EnWriteoffReason = EnWriteoffReason.Production
  setReason(reason: EnWriteoffReason) {
    this.reason = reason
  }
  dialogOpen = false
  setDialogOpen(v: boolean) {
    this.dialogOpen = v
  }
  constructor() {
    makeAutoObservable(this)
  }
  validate(): Error | undefined {
    if (parseFloat(this.weight) === 0) {
      return new Error('Вес не указан')
    }
  }
  getTypeData(): WriteoffDirectUnit {
    return {}
  }
  async save(materialId?: number): Promise<number[]> {
    if (!materialId) {
      throw new Error('Material ID is not set')
    }
    await rpc.material.writeoffTroughMaterial.mutate({
      material_id: materialId,
      qty: parseFloat(this.weight),
      reason: this.reason,
      type_data: this.getTypeData()
    })
    return []
  }
}

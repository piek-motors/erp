import { makeAutoObservable, rpc } from 'lib/deps'
import { EnWriteoffReason, WriteoffDirectUnit } from 'models'

export class MaterialWriteoffState {
  length = ''
  setLength(length: string) {
    this.length = length
  }
  reason: EnWriteoffReason = EnWriteoffReason.UsedInProduction
  setReason(reason: EnWriteoffReason) {
    this.reason = reason
  }
  constructor() {
    makeAutoObservable(this)
  }
  validate(): Error | undefined {
    if (parseFloat(this.length) === 0) {
      return new Error('Длина не указана')
    }
  }
  reset() {
    this.length = ''
  }
  getTypeData(): WriteoffDirectUnit {
    return {}
  }
  disabled() {
    return this.length === '' || this.reason == null
  }
  async insertWriteoff(materialId?: number): Promise<number> {
    if (!materialId) {
      throw new Error('Material ID is not set')
    }
    const stock = await rpc.metal.material.writeoff.mutate({
      material_id: materialId,
      lengthMeters: Number(this.length),
      reason: this.reason,
      type_data: this.getTypeData()
    })

    return Number(stock)
  }
}

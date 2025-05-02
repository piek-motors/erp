import { Material } from 'shared/domain'
import { EnWriteoffReason, EnWriteoffType } from 'shared/enumerations'
import create from 'zustand'

export interface IWriteOff {
  id?: number
  setId(id: number): void
  type: number
  setType(type: number): void
  qty: number
  setQty(qty: number): void
  typeData: Record<string, any>
  addTypeDataProprty(typeData: Record<string, any>): void
  material?: Material
  setMaterial(material: Material): void
  reason?: EnWriteoffReason
  setReason(reason: EnWriteoffReason): void
  shapeDependentData: Record<string, any>
  setShapeDependentData(shapeDependentData: Record<string, any>): void
  reset(): void
}

export const useWriteOffStore = create<IWriteOff>(set => ({
  id: 0,
  setId(id: number) {
    set({ id })
  },

  qty: 0,
  setQty(qty: number) {
    set({ qty })
  },

  type: EnWriteoffType.ThroughDetail,
  setType(type: number) {
    set({ type })
  },

  typeData: {},
  addTypeDataProprty(typeData: object) {
    set({ typeData: { ...this.typeData, ...typeData } })
  },

  material: undefined,
  setMaterial(material: Material) {
    set({ material })
  },

  reason: EnWriteoffReason.Production,
  setReason(reason: number) {
    set({ reason })
  },

  shapeDependentData: {},
  setShapeDependentData(shapeDependentData: Record<string, any>) {
    set({ shapeDependentData })
  },
  reset() {
    set({
      id: 0,
      type: EnWriteoffType.ThroughDetail,
      typeData: {},
      material: undefined,
      reason: EnWriteoffReason.Production,
      shapeDependentData: {},
      qty: 0
    })
  }
}))

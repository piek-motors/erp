import { Detail, Material } from 'domain-model'
import { create } from 'zustand'

export interface IDetail {
  detailID: number
  name: string
  setName(name: string): void
  materials: Map<
    Material,
    | {
        length: string
        weight: string
      }
    | undefined
  >
  setMaterials(materials: Material[]): void
  addMaterial(material: Material): void
  updMaterialRelationData(materialId: number, data: object): void
  unpack(s: Detail): void

  // history
  recentlyAdded?: Detail
  recentlyUpdated?: Detail
  setRecentlyAdded(detail: Detail): void
  setRecentlyUpdated(detail: Detail): void

  reset(): void
}

export const useDetail = create<IDetail>((set, get) => ({
  detailID: 0,
  name: '',
  materials: new Map(),
  addMaterialCost(materialId: number, cost: string) {
    set({
      materials: {
        ...this.materials,
        [materialId]: cost
      }
    })
  },
  setRecentlyAdded(detail: Detail) {
    set({ recentlyAdded: detail })
  },
  setRecentlyUpdated(detail: Detail) {
    set({ recentlyUpdated: detail })
  },
  setName(name: string) {
    set({ name })
  },
  setMaterials(materials: Material[]) {
    set({
      materials: new Map(materials.map(m => [m, undefined]))
    })
  },
  addMaterial(material: Material) {
    set({
      materials: new Map([...this.materials, [material, undefined]])
    })
  },
  updMaterialRelationData(materialId: number, data: any) {
    const newMaterials = new Map(this.materials)
    for (const key of newMaterials.keys()) {
      if (key.id === materialId) {
        const newData = { ...newMaterials.get(key), ...data }
        newMaterials.set(key, newData)
        break
      }
    }
    set({ materials: newMaterials })
  },
  unpack(s: Detail) {
    const map = new Map<Material, { weight: string; length: string }>()
    for (const [material, relationData] of s.materials.entries()) {
      map.set(material, {
        weight: relationData?.weight?.toString() || '',
        length: relationData?.length?.toString() || ''
      })
    }
    set({
      detailID: s.id,
      name: s.name,
      materials: map
    })
  },
  reset() {
    set({
      detailID: 0,
      name: '',
      materials: new Map(),
      recentlyAdded: undefined,
      recentlyUpdated: undefined
    })
  }
}))

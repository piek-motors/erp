import { GetDetailByPkQuery } from 'src/types/graphql-shema'
import create from 'zustand'
import { Detail } from '../domain/detail'
import { Material } from '../domain/material'

interface IDetail {
  id: number
  name: string
  detailLength?: number
  weight?: number
  setLength(length: number): void
  setWeight(weight: number): void

  materials: Material[] // Detail Made from materials
  materialCosts: Record<number, string>
  addMaterialCost(materialId: number, cost: string): void

  recentlyAdded?: Detail
  recentlyUpdated?: Detail
  setRecentlyAdded(detail: Detail): void
  setRecentlyUpdated(detail: Detail): void

  setMaterials(materials: Material[]): void
  addMaterial(material: Material): void
  setName(name: string): void
  updMaterialById(materialId: number, material: Material): void
  unpack(s: GetDetailByPkQuery['metal_pdo_details_by_pk']): void
  reset(): void
}

export const useDetail = create<IDetail>(set => ({
  id: 0,
  name: '',
  materials: [],
  materialCosts: {},
  setLength(length: number) {
    set({ detailLength: length })
  },
  setWeight(weight: number) {
    set({ weight })
  },
  addMaterialCost(materialId: number, cost: string) {
    set({
      materialCosts: {
        ...this.materialCosts,
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
    set({ materials })
  },
  addMaterial(material: Material) {
    set({ materials: [...this.materials, material] })
  },
  updMaterialById(materialId: number, material: Material) {
    set({
      materials: this.materials.map(m => {
        if (m.id == materialId) {
          return material
        }
        return m
      })
    })
  },
  unpack(s: GetDetailByPkQuery['metal_pdo_details_by_pk']) {
    set({
      name: s?.name,
      id: s?.id,
      materials: s?.detail_materials.map(e => Material.fromDto(e.material)),
      materialCosts: s?.detail_materials.reduce(
        (acc, e) => ({
          ...acc,
          [e.material.id]: e.cost
        }),
        {}
      )
    })
  },
  reset() {
    set({
      id: 0,
      name: '',
      materials: [],
      materialCosts: {},
      recentlyAdded: undefined,
      recentlyUpdated: undefined
    })
  }
}))

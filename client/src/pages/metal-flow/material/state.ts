import { plainToInstance } from 'class-transformer'
import {
  CircleShapeData,
  getShapeDataConstructor,
  MaterialShapeData,
  MaterialShapeDataConstructor
} from 'shared'
import { Material } from 'shared/domain'
import { EnMaterialShape, EnUnit } from 'shared/enumerations'
import { create } from 'zustand'

export interface IMaterialState {
  id: number
  unit: EnUnit
  shape: EnMaterialShape
  shapeData?: MaterialShapeData
  syncState(material: Material): void
  setId(id: number): void
  setUnit(unit: EnUnit): void
  setShape(shape: EnMaterialShape): void
  setShapeData(shapeData: MaterialShapeData): void
  clear(): void
}

export const useMaterialStore = create<IMaterialState>((set, get) => ({
  id: 0,
  unit: EnUnit.Kg,
  shape: EnMaterialShape.Circle,
  shapeData: new CircleShapeData(),
  setId(id: number) {
    set({ id })
  },
  setUnit(unit: EnUnit) {
    set({ unit })
  },
  setShape(shape: EnMaterialShape) {
    const constructor = getShapeDataConstructor(shape)
    if (!constructor) {
      throw new Error(`Constructor for shape ${shape} not found`)
    }
    set({ shape, shapeData: new constructor() })
  },
  setShapeData(shapeData: MaterialShapeData) {
    set({ shapeData })
  },
  syncState(material: Material) {
    const ShapeData = MaterialShapeDataConstructor[material.shapeId]
    if (!ShapeData) {
      throw new Error(`Constructor for shape ${material.shapeId} not found`)
    }
    const constructor = getShapeDataConstructor(material.shapeId)
    if (!constructor) {
      throw new Error(`Constructor for shape ${material.shapeId} not found`)
    }
    const instance = plainToInstance(constructor as any, material.shapeData)
    set({
      id: material.id,
      shape: material.shapeId,
      shapeData: instance as any,
      unit: material.unitId
    })
  },
  clear() {
    set({
      id: 0,
      unit: EnUnit.Kg,
      shape: EnMaterialShape.Circle,
      shapeData: new CircleShapeData()
    })
  }
}))

export interface MaterialSeachStore {
  filterKeyword?: string
  search(keyword: string): void
  materials: Material[]
  searchResult: number[]
  setMaterials(materials: Material[]): void
}

export const useMaterialListStore = create<MaterialSeachStore>((set, get) => ({
  materials: [],
  searchResult: [],
  setMaterials(materials: Material[]) {
    set({ materials })
  },
  async search(keyword: string) {
    const res: number[] = []
    const materuals = get().materials
    for (const each of materuals) {
      if (
        each
          .getTextId()
          .toLocaleLowerCase()
          .includes(keyword.toLocaleLowerCase())
      ) {
        res.push(each.id)
      }
    }
    set({ filterKeyword: keyword, searchResult: res })
  },
  clear() {
    set({
      materials: [],
      filterKeyword: undefined,
      searchResult: []
    })
  }
}))

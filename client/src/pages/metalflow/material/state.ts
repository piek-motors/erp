import { plainToInstance } from 'class-transformer'
import FlexSearch, { Index } from 'flexsearch'
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
  index: Index
  filterKeyword?: string
  setFilterKeyword(keyword: string): void
  materials: Material[]
  searchResult: number[]
  setMaterials(materials: Material[]): void
}

export const useMaterialListStore = create<MaterialSeachStore>((set, get) => ({
  materials: [],
  index: new FlexSearch.Index({
    tokenize: 'full'
  }),
  searchResult: [],
  setMaterials(materials: Material[]) {
    const index = get().index
    index.clear()
    materials.forEach(each => {
      index.add(each.id, each.getTextId())
    })
    set({ materials })
  },
  async setFilterKeyword(keyword: string) {
    const index = get().index

    const result = await index.search(keyword)

    const res: number[] = []
    for (const each in result) {
      res.push(Number(each))
    }
    console.log(res)
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

import { MaterialShape, MaterialShapeDataConstructor } from 'shared'
import { EnMaterialShape, EnUnit } from 'shared/enumerations'
import create from 'zustand'

export interface IMaterialState {
  id: number
  unit: EnUnit
  shape: EnMaterialShape
  shapeData?: MaterialShape

  setId(id: number): void
  setUnit(unit: EnUnit): void
  setShape(shape: EnMaterialShape): void
  setShapeData(shapeData: MaterialShape): void
  updateShapeDataProperty(propName: string, value: any): void
}

export const useMaterialStore = create<IMaterialState>((set, get) => ({
  id: 0,
  unit: EnUnit.Kg,
  shape: EnMaterialShape.Circle,
  setId(id: number) {
    set({ id })
  },
  setUnit(unit: EnUnit) {
    set({ unit })
  },
  setShape(shape: EnMaterialShape) {
    const ShapeData = MaterialShapeDataConstructor[shape]
    set({ shape, shapeData: new ShapeData() })
  },
  setShapeData(shapeData: MaterialShape) {
    set({ shapeData })
  },
  updateShapeDataProperty(propName: string, value: any) {
    const currentShapeData = get().shapeData
    if (!currentShapeData) {
      throw new Error('Shape data not set')
    }

    Object.assign(currentShapeData, { [propName]: value })
  }
}))

import { EnMaterialShape, EnUnit } from 'shared/enumerations'
import { Metal_Pdo_Materials_Set_Input } from 'src/types/graphql-shema'
import create from 'zustand'

interface IMaterial {
  id: number
  setId(id: number): void

  unit: EnUnit
  setUnit(unit: EnUnit): void

  shape: EnMaterialShape
  setShape(shape: EnMaterialShape): void

  shapeData: Record<string, any>
  setShapeData(shapeData: Record<string, any>): void

  unpack(s: Metal_Pdo_Materials_Set_Input): IMaterial
  pack(): Metal_Pdo_Materials_Set_Input
}

export const useMaterialStore = create<IMaterial>(set => ({
  id: 0,
  setId(id: number) {
    set({ id })
  },

  unit: EnUnit.Kg,
  shape: EnMaterialShape.Circle,
  shapeData: {},

  setUnit(unit: EnUnit) {
    set({ unit })
  },
  setShape(shape: EnMaterialShape) {
    set({ shape })
  },
  setShapeData(shapeData: Record<string, any>) {
    set({ shapeData })
  },
  unpack(s: Metal_Pdo_Materials_Set_Input) {
    set({
      id: s.id!,
      unit: s.unit as EnUnit,
      shape: s.shape as EnMaterialShape,
      shapeData: s.shape_data
    })
    return this
  },
  pack() {
    return {
      id: this.id,
      unit: this.unit,
      shape: this.shape,
      shape_data: this.shapeData
    }
  }
}))

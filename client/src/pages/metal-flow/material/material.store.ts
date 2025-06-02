import {
  EnMaterialShape,
  EnUnit,
  GenericShapeData,
  getMaterialConstructor,
  getShapeDataConstructor,
  Material,
  RoundBar,
  RoundBarShapeData
} from 'domain-model'
import { makeAutoObservable } from 'mobx'
import * as api from './material.api'

export class MaterialStore {
  constructor() {
    makeAutoObservable(this)
  }

  id?: number
  unit: EnUnit = EnUnit.Kg
  shape: EnMaterialShape = EnMaterialShape.RoundBar
  shapeData: GenericShapeData = new RoundBarShapeData()

  loading = false
  error: Error | null = null
  material?: Material

  clear() {
    this.id = undefined
    this.unit = EnUnit.Kg
    this.shape = EnMaterialShape.RoundBar
    this.shapeData = new RoundBar(0)
  }

  insertedMaterialId?: number

  setShape(shape: EnMaterialShape) {
    this.shape = shape
    const Shape = getShapeDataConstructor(shape)
    this.shapeData = new Shape(0)
  }

  setUnit(unit: EnUnit) {
    this.unit = unit
  }

  syncState(material: Material) {
    this.id = material.id || undefined
    this.unit = material.unit
    this.setShape(material.shape)
    this.shapeData = material.exportShapeData()
  }

  setShapeData(shapeData: GenericShapeData) {
    this.shapeData = shapeData
  }

  private async withStateManagement<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    this.loading = true
    this.error = null
    try {
      return await operation()
    } catch (e) {
      this.error = e as Error
      throw e
    } finally {
      this.loading = false
    }
  }

  async load(id: number) {
    return this.withStateManagement(async () => {
      const material = await api.getMaterial(id)
      this.syncState(material)
      return material
    })
  }

  async insert() {
    return this.withStateManagement(async () => {
      const MaterialConstructor = getMaterialConstructor(this.shape)
      const m = new MaterialConstructor(0).init(null, '', this.shapeData as any)
      const id = await api.insertMaterial({
        object: {
          unit: this.unit,
          shape: this.shape,
          label: m.deriveLabel(),
          shape_data: this.shapeData
        }
      })
      this.insertedMaterialId = id
      this.clear()
      return id
    })
  }

  async update() {
    return this.withStateManagement(async () => {
      if (!this.id) throw new Error('Material id is not set')
      await api.updateMaterial({
        id: this.id,
        _set: { shape: this.shape, shape_data: this.shapeData }
      })
    })
  }
}

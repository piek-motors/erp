import {
  EnMaterialShape,
  EnUnit,
  GenericShapeData,
  getMaterialConstructor,
  getShapeDataFactory,
  Material,
  MaterialShapeAbstractionLayer,
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
  label?: string
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
    const Shape = getShapeDataFactory(shape)
    this.shapeData = new Shape()
  }

  setUnit(unit: EnUnit) {
    this.unit = unit
  }

  syncState(material: Material) {
    this.id = material.id || undefined
    this.label = material.label
    this.unit = material.unit
    this.setShape(material.shape)
    this.shapeData = MaterialShapeAbstractionLayer.exportShapeData(material)
    this.material = material
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
      const material = new MaterialConstructor(0)
      MaterialShapeAbstractionLayer.importShapeData(material, this.shapeData)
      const id = await api.insertMaterial({
        object: {
          unit: this.unit,
          shape: this.shape,
          label: material.deriveLabel(),
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
      if (!this.material) throw new Error('Material is not set')

      MaterialShapeAbstractionLayer.importShapeData(
        this.material,
        this.shapeData
      )

      return await api.updateMaterial({
        id: this.id,
        _set: {
          shape: this.shape,
          shape_data: this.shapeData,
          label: this.material?.deriveLabel()
        }
      })
    }).then(res => {
      if (!this.id) throw new Error('Material id is not set')
      this.load(this.id)
      return res
    })
  }
}

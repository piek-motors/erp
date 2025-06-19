import {
  Detail,
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
import { AsyncStoreController } from 'lib/async-store.controller'
import { makeAutoObservable } from 'mobx'
import * as api from './material.api'

export class MaterialStore {
  readonly async = new AsyncStoreController()
  constructor() {
    makeAutoObservable(this)
  }

  id?: number
  label?: string
  unit: EnUnit = EnUnit.Kg
  shape: EnMaterialShape = EnMaterialShape.RoundBar
  shapeData: GenericShapeData = new RoundBarShapeData()

  material?: Material
  detailsMadeOfMaterial: Detail[] = []

  setDetailsMadeOfMaterial(details: Detail[]) {
    this.detailsMadeOfMaterial = details
  }

  clear() {
    this.id = undefined
    this.unit = EnUnit.Kg
    this.shape = EnMaterialShape.RoundBar
    this.shapeData = new RoundBar(0)
    this.detailsMadeOfMaterial = []
  }

  insertedMaterialId?: number

  setShape(shape: EnMaterialShape) {
    const Shape = getShapeDataFactory(shape)
    this.shape = shape
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

  async load(id: number) {
    return this.async.run(async () => {
      const material = await api.getMaterial(id)
      this.syncState(material)
      return material
    })
  }

  async insert() {
    return this.async.run(async () => {
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
    return this.async
      .run(async () => {
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
      })
      .then(res => {
        if (!this.id) throw new Error('Material id is not set')
        this.load(this.id)
        return res
      })
  }

  async loadDetailsMadeOfMaterial() {
    if (!this.material) return

    const details = await api.getDetailsMadeOfMaterial(this.material)
    this.setDetailsMadeOfMaterial(details)
  }
}

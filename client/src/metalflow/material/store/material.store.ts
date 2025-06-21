import {
  Detail,
  EnMaterialShape,
  EnUnit,
  getMaterialConstructor,
  Material,
  MaterialShapeAbstractionLayer
} from 'domain-model'
import { AsyncStoreController } from 'lib/async-store.controller'
import { makeAutoObservable } from 'lib/deps'
import { rpc } from 'lib/rpc.client'
import { ListState } from '../shape/list_state'
import { PipeState } from '../shape/pipe_state'
import { RoundBarState } from '../shape/rounde_bar.state'
import { SquareState } from '../shape/square_state'
import * as api from './material.api'
import { IMaterialShapeState } from './matetial_shape_state.interface'

export class MaterialStore {
  readonly async = new AsyncStoreController()
  constructor() {
    makeAutoObservable(this)
  }

  list = new ListState()
  round = new RoundBarState()
  square = new SquareState()
  pipe = new PipeState()

  shapeState = {
    [EnMaterialShape.RoundBar]: this.round,
    [EnMaterialShape.SquareBar]: this.square,
    [EnMaterialShape.Pipe]: this.pipe,
    [EnMaterialShape.List]: this.list
  } as const

  getShapeState(shape: EnMaterialShape): IMaterialShapeState {
    return this.shapeState[shape]
  }

  id?: number
  label?: string
  unit: EnUnit = EnUnit.Kg
  setUnit(unit: EnUnit) {
    this.unit = unit
  }
  shape: EnMaterialShape = EnMaterialShape.RoundBar
  setShape(shape: EnMaterialShape) {
    this.shape = shape
  }
  material?: Material
  detailsMadeOfMaterial: Detail[] = []

  setDetailsMadeOfMaterial(details: Detail[]) {
    this.detailsMadeOfMaterial = details
  }

  clear() {
    this.id = undefined
    this.unit = EnUnit.Kg
    this.shape = EnMaterialShape.RoundBar
    this.getShapeState(this.shape).reset()
    this.detailsMadeOfMaterial = []
  }

  insertedMaterialId?: number

  syncState(material: Material) {
    this.id = material.id || undefined
    this.label = material.label
    this.unit = material.unit
    this.setShape(material.shape)
    this.material = material
    this.getShapeState(this.shape).sync(material)
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
      MaterialShapeAbstractionLayer.importShapeData(
        material,
        this.getShapeState(this.shape).export()
      )

      const id = await api.insertMaterial({
        object: {
          unit: this.unit,
          shape: this.shape,
          label: material.deriveLabel(),
          shape_data: this.getShapeState(this.shape).export()
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
          this.getShapeState(this.shape).export()
        )

        return await api.updateMaterial({
          id: this.id,
          _set: {
            shape: this.shape,
            shape_data: this.getShapeState(this.shape).export(),
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

  async delete() {
    return this.async.run(async () => {
      if (!this.id) throw new Error('Material id is not set')
      await rpc.material.delete.mutate({ id: this.id })
    })
  }
}

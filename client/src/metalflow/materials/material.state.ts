import {
  EnMaterialShape,
  EnUnit,
  getMaterialConstructor,
  Material,
  MaterialShapeAbstractionLayer,
  uiUnit
} from 'domain-model'
import { AsyncStoreController } from 'lib/async-store.controller'
import { makeAutoObservable } from 'lib/deps'
import { rpc } from 'lib/rpc.client'
import { map } from 'metalflow/mappers'
import { cache } from 'metalflow/metal_flow_cache'
import { IMaterialShapeState } from './matetial_shape_state.interface'
import { ListState } from './shape/list_state'
import { PipeState } from './shape/pipe_state'
import { RoundBarState } from './shape/rounde_bar.state'
import { SquareState } from './shape/square_state'
import { MaterialSupplyStore } from './supply/state'
import { MaterialWriteoffState } from './writeoff/state'

interface IDetail {
  id: number
  name: string
  group_id: number | null
}

export class MaterialStore {
  readonly async = new AsyncStoreController()
  readonly supply = new MaterialSupplyStore()
  readonly writeoff = new MaterialWriteoffState()
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
  setId(id: number) {
    this.id = id
  }
  label?: string
  setLabel(label: string) {
    this.label = label
  }
  unit: EnUnit = EnUnit.Kg
  setUnit(unit: EnUnit) {
    this.unit = unit
  }
  shape: EnMaterialShape = EnMaterialShape.RoundBar
  setShape(shape: EnMaterialShape) {
    this.shape = shape
  }
  stock: number = 0
  setStock(stock: number) {
    this.stock = stock
  }
  material?: Material
  detailsMadeFromThisMaterial: IDetail[] = []
  setDetailsMadeFromThisMaterial(details: IDetail[]) {
    this.detailsMadeFromThisMaterial = details
  }

  clear() {
    this.id = undefined
    this.unit = EnUnit.Kg
    this.shape = EnMaterialShape.RoundBar
    this.getShapeState(this.shape).reset()
    this.detailsMadeFromThisMaterial = []
  }

  insertedMaterialId?: number

  syncState(material: Material) {
    this.setId(material.id)
    this.setLabel(material.label)
    this.unit = material.unit
    this.setShape(material.shape)
    this.material = material
    this.getShapeState(this.shape).sync(material)
    this.setStock(material.stock)
  }

  async load(id?: number) {
    if (!id) throw new Error('Material id is not set')
    return this.async.run(async () => {
      const res = await rpc.material.get.query({ id })
      this.syncState(map.material.fromDto(res))
      this.setDetailsMadeFromThisMaterial(
        res.details.map(e => ({
          id: e.detail_id,
          name: e.name,
          group_id: e.logical_group_id
        }))
      )

      return res
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

      const res = await rpc.material.create.mutate({
        label: material.deriveLabel(),
        shape: this.shape,
        shape_data: this.getShapeState(this.shape).export(),
        unit: this.unit
      })
      this.insertedMaterialId = res.id
      this.clear()
      await cache.materials.load()
      return res.id
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

        return await rpc.material.update.mutate({
          id: this.id,
          shape: this.shape,
          shape_data: this.getShapeState(this.shape).export(),
          label: this.material?.deriveLabel(),
          unit: this.unit
        })
      })
      .then(async res => {
        if (!this.id) throw new Error('Material id is not set')
        this.load(this.id)
        await cache.materials.load()
        return res
      })
  }

  async delete() {
    return this.async.run(async () => {
      if (!this.id) throw new Error('Material id is not set')
      await rpc.material.delete.mutate({ id: this.id })
      const materialToRemove = cache.materials
        .getMaterials()
        .find(m => m.id === this.id)
      if (materialToRemove) {
        cache.materials.removeMaterial(materialToRemove)
      }
    })
  }

  async insertSupply() {
    return this.async.run(async () => {
      const qty = await this.supply.insertSupply(this.id)
      this.supply.reset()
      this.setStock(Number(qty))
      await cache.materials.load()
      return `Баланс: ${qty} ${uiUnit(this.unit)}`
    })
  }

  async insertWriteoff() {
    return this.async.run(async () => {
      const stock = await this.writeoff.insertWriteoff(this.id)
      this.writeoff.reset()
      await this.load(this.id)
      await cache.materials.load()
      return `Баланс: ${stock} ${uiUnit(this.unit)}`
    })
  }
}
export const material = new MaterialStore()

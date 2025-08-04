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
import { cache } from 'metalflow/cache/root'
import { map } from 'metalflow/mappers'
import { MaterialSupplyStore } from './operations/supply/state'
import { MaterialWriteoffState } from './operations/writeoff/state'
import { HexagonBarState } from './shape/hexagon_bar.state'
import { ListState } from './shape/list_state'
import { PipeState } from './shape/pipe_state'
import { RoundBarState } from './shape/rounde_bar.state'
import { SquareState } from './shape/square_state'
import { IMaterialShapeState } from './shape_state.interface'

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
  hexagon = new HexagonBarState()

  shapeState = {
    [EnMaterialShape.RoundBar]: this.round,
    [EnMaterialShape.SquareBar]: this.square,
    [EnMaterialShape.Pipe]: this.pipe,
    [EnMaterialShape.List]: this.list,
    [EnMaterialShape.HexagonBar]: this.hexagon
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
  linearMass = ''
  setLinearMass(linearMass: string) {
    this.linearMass = linearMass
  }
  alloy?: string
  setAlloy(alloy: string) {
    this.alloy = alloy
  }
  material?: Material

  detailCount: number = 0
  setDetailCount(detailCount: number) {
    this.detailCount = detailCount
  }

  clear() {
    this.id = undefined
    this.getShapeState(this.shape).reset()
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
      const res = await rpc.metal.material.get.query({ id })
      this.setLinearMass(res.material.linear_mass.toString())
      this.setAlloy(res.material.alloy || '')
      this.syncState(map.material.fromDto(res))
      this.setDetailCount(Number(res.detailCount))
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
      const label = material.deriveLabel()
      console.log('creating material', label)
      if (!label) throw new Error('Material label is not set')
      const res = await rpc.metal.material.create.mutate({
        label,
        shape: this.shape,
        shape_data: this.getShapeState(this.shape).export(),
        unit: this.unit,
        linear_mass: Number(this.linearMass),
        alloy: this.alloy || null
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
        this.material.alloy = this.alloy || ''

        return await rpc.metal.material.update.mutate({
          id: this.id,
          shape: this.shape,
          shape_data: this.getShapeState(this.shape).export(),
          label: this.material?.deriveLabel(),
          unit: this.unit,
          linear_mass: Number(this.linearMass),
          alloy: this.alloy || null
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
      await rpc.metal.material.delete.mutate({ id: this.id })
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

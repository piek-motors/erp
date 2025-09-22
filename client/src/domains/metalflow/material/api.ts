import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/deps'
import { makeAutoObservable } from 'mobx'
import { getMaterialConstructor, MaterialShapeAbstractionLayer } from 'models'
import { cache } from '../cache/root'
import { map } from '../mappers'
import { MaterialState } from './state'

export class MaterialApi {
  readonly status = new AsyncStoreController()
  s: MaterialState = new MaterialState()
  reset() {
    this.s = new MaterialState()
  }
  constructor() {
    makeAutoObservable(this)
  }

  async load(id?: number) {
    if (!id) throw new Error('Material id is not set')
    return this.status.run(async () => {
      const res = await rpc.metal.material.get.query({ id })
      this.s.setLinearMass(res.material.linear_mass.toString())
      this.s.setAlloy(res.material.alloy || '')
      this.s.setSafetyStock(res.material.safety_stock?.toString())
      this.s.setUnit(res.material.unit)
      this.s.syncState(map.material.fromDto(res))
      this.s.setDetailCount(Number(res.detailCount))
      return res
    })
  }

  async insert() {
    const MaterialConstructor = getMaterialConstructor(this.s.shape)
    const material = new MaterialConstructor(0)
    MaterialShapeAbstractionLayer.importShapeData(
      material,
      this.s.getShapeState(this.s.shape).export()
    )
    const label = material.deriveLabel()
    if (!label) throw new Error('Material label is not set')
    const res = await rpc.metal.material.create.mutate({
      label,
      shape: this.s.shape,
      shape_data: this.s.getShapeState(this.s.shape).export(),
      unit: this.s.unit || null,
      linear_mass: Number(this.s.linearMass),
      alloy: this.s.alloy || null
    })
    this.s = new MaterialState()
    this.s.insertedMaterialId = res.id
    await cache.materials.load()
    return res.id
  }

  async update() {
    if (!this.s.id) throw new Error('Material id is not set')
    if (!this.s.material) throw new Error('Material is not set')
    if (!this.s.unit) throw new Error('Material unit is not set')

    MaterialShapeAbstractionLayer.importShapeData(
      this.s.material,
      this.s.getShapeState(this.s.shape).export()
    )
    this.s.material.alloy = this.s.alloy || ''

    return rpc.metal.material.update
      .mutate({
        id: this.s.id,
        shape: this.s.shape,
        shape_data: this.s.getShapeState(this.s.shape).export(),
        label: this.s.material?.deriveLabel(),
        unit: this.s.unit,
        linear_mass: Number(this.s.linearMass),
        alloy: this.s.alloy || null,
        safety_stock: Number(this.s.safetyStock)
      })
      .then(async res => {
        if (!this.s.id) throw new Error('Material id is not set')
        this.load(this.s.id)
        await cache.materials.load()
        return res
      })
  }

  async delete() {
    if (!this.s.id) throw new Error('Material id is not set')
    await rpc.metal.material.delete.mutate({ id: this.s.id })
    const materialToRemove = cache.materials
      .getMaterials()
      .find(m => m.id === this.s.id)
    if (materialToRemove) {
      cache.materials.removeMaterial(materialToRemove)
    }
  }

  async loadDetailsMadeFromThatMaterial(material_id: number) {
    const res = await rpc.metal.details.listByMaterialId.query({ material_id })
    this.s.setDetailsMadeFromThisMaterial(
      res.map(e => ({
        id: e.detail_id,
        name: e.name,
        group_id: e.logical_group_id
      }))
    )
  }
}

export const api = new MaterialApi()

import { rpc } from 'lib/deps'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable } from 'mobx'
import { getMaterialConstructor, MaterialShapeAbstractionLayer } from 'models'
import { cache } from '../cache/root'
import { map } from '../mappers'
import { MaterialState } from './state'

export class MaterialApi {
  readonly loader = new LoadingController()
  constructor() {
    makeAutoObservable(this)
  }

  async load(id: number) {
    const m = new MaterialState()
    return this.loader.run(async () => {
      const res = await rpc.pdo.material.get.query({ id })
      m.syncState(map.material.fromDto(res))
      m.setLabel(res.material.label)
      m.setLinearMass(res.material.linear_mass.toString())
      m.setAlloy(res.material.alloy || '')
      m.setSafetyStock(res.material.safety_stock)
      m.setUnit(res.material.unit)
      m.setDetailCount(Number(res.detailCount))
      m.writeoffStat = {
        monthly: res.writeoff_stat.monthly,
        quarterly: res.writeoff_stat.quarterly
      }
      return m
    })
  }

  async insert(m: MaterialState) {
    const MaterialConstructor = getMaterialConstructor(m.shape)
    const material = new MaterialConstructor(0)
    MaterialShapeAbstractionLayer.importShapeData(
      material,
      m.getShapeState(m.shape).export()
    )
    const label = material.deriveLabel()
    if (!label) throw new Error('Material label is not set')
    const res = await rpc.pdo.material.create.mutate({
      label,
      shape: m.shape,
      shape_data: m.getShapeState(m.shape).export(),
      unit: m.unit || null,
      // linear_mass: Number(m.linearMass),
      alloy: m.alloy || null
    })
    m = new MaterialState()
    await cache.materials.load()
    return res.id
  }

  async update(m: MaterialState) {
    if (!m.id) throw new Error('Material id is not set')
    if (m.material == null) throw new Error('Material is not set')
    if (m.unit == null) throw new Error('Material unit is not set')

    MaterialShapeAbstractionLayer.importShapeData(
      m.material,
      m.getShapeState(m.shape).export()
    )
    m.material.alloy = m.alloy || ''

    return rpc.pdo.material.update
      .mutate({
        id: m.id,
        shape: m.shape,
        shape_data: m.getShapeState(m.shape).export(),
        label: m.material?.deriveLabel(),
        unit: m.unit,
        // linear_mass: Number(m.linearMass),
        alloy: m.alloy || null,
        safety_stock: Number(m.safetyStock)
      })
      .then(async res => {
        if (!m.id) throw new Error('Material id is not set')
        const updated = await this.load(m.id)
        cache.materials.load()
        return updated
      })
  }

  async delete(id: number) {
    await rpc.pdo.material.delete.mutate({ id })
    const materialToRemove = cache.materials
      .getMaterials()
      .find(m => m.id === id)
    if (materialToRemove) {
      cache.materials.removeMaterial(materialToRemove)
    }
  }

  async loadDetailsMadeFromThatMaterial(material_id: number) {
    const res = await rpc.pdo.details.filter_by_material.query({
      material_id
    })
    return res.map(e => ({
      id: e.id,
      name: e.name,
      group_id: e.logical_group_id
    }))
  }
}

export const api = new MaterialApi()

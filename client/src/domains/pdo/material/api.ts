import { rpc } from 'lib/deps'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable } from 'mobx'
import { getMaterialConstructor, MaterialShapeAbstractionLayer } from 'models'
import { RouterInput } from 'srv/lib/trpc'
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
      m.setUnit(res.material.unit)
      m.setDetailCount(Number(res.detailCount))
      m.writeoffStat = {
        monthly: res.writeoff_stat.monthly,
        quarterly: res.writeoff_stat.quarterly
      }
      m.shortagePredictionHorizonDays =
        res.material.shortage_prediction_horizon_days
      return m
    })
  }

  async insert(m: MaterialState) {
    const res = await rpc.pdo.material.create.mutate(this.create_payload(m))
    m = new MaterialState()
    await cache.materials.load()
    return res.id
  }

  async update(m: MaterialState) {
    if (!m.id) throw new Error('Material id is not set')
    const payload = this.create_payload(m)
    return rpc.pdo.material.update
      .mutate({
        ...payload,
        id: m.id
      })
      .then(async res => {
        if (!m.id) throw new Error('Material id is not set')
        const updated = await this.load(m.id)
        cache.materials.load()
        return updated
      })
  }

  private create_payload(
    m: MaterialState
  ): RouterInput['pdo']['material']['create'] {
    const MaterialConstructor = getMaterialConstructor(m.shape)
    const material = new MaterialConstructor(0)
    MaterialShapeAbstractionLayer.importShapeData(
      material,
      m.getShapeState(m.shape).export()
    )
    const label = material.deriveLabel()
    if (!label) throw new Error('Material label is not set')
    if (m.unit == null) throw new Error('Не выбрана единица учета остатков')
    return {
      label,
      shape: m.shape,
      shape_data: m.getShapeState(m.shape).export(),
      unit: m.unit,
      alloy: m.alloy || null,
      shortage_prediction_horizon_days: m.shortagePredictionHorizonDays
    }
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

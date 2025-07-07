import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from '../../../server/src/lib/trpc'
import { Detail, MaterialCost } from './details/detail.store'
import { detailListStore } from './details/list/state'

class DetailCache {
  private details: Detail[] = []
  setDetails(details: Detail[]) {
    this.details = details
  }
  getDetails() {
    return this.details
  }
  removeDetail(id: number) {
    this.setDetails(this.details.filter(d => d.id !== id))
  }
  addDetail(detail: Detail) {
    this.setDetails([...this.details, detail])
  }
  updateDetail(detail: Detail) {
    this.setDetails(this.details.map(d => (d.id === detail.id ? detail : d)))
  }
  constructor() {
    makeAutoObservable(this)
  }
  async load() {
    const details = await rpc.metal.details.list.query()

    this.setDetails(
      details.map(detail => {
        const groupId = detail[4] as number | null
        return new Detail({
          id: detail[0] as number,
          name: detail[1] as string,
          partCode: detail[2] as string,
          groupId,
          usedMaterials: (detail[3] as [number, string, number, number][]).map(
            e => {
              return new MaterialCost({
                materialId: e[0],
                label: e[1],
                length: e[2].toString(),
                weight: e[3].toString()
              })
            }
          )
        })
      })
    )
  }
}

export type Material = RouterOutput['metal']['material']['list'][number]

class MaterialCache {
  private materials: Material[] = []
  setMaterials(materials: Material[]) {
    this.materials = materials
  }
  getMaterials() {
    return this.materials
  }
  removeMaterial(material: Material) {
    this.setMaterials(this.materials.filter(m => m.id !== material.id))
  }
  addMaterial(material: Material) {
    this.setMaterials([...this.materials, material])
  }
  updateMaterial(material: Material) {
    this.setMaterials(
      this.materials.map(m => (m.id === material.id ? material : m))
    )
  }
  constructor() {
    makeAutoObservable(this)
  }
  async load() {
    const materials = await rpc.metal.material.list.query()
    this.setMaterials(materials)
  }
}

export type DetailGroup = RouterOutput['metal']['detailGroups']['list'][number]
class DetailGroupCache {
  private groups: DetailGroup[] = []
  setGroups(groups: DetailGroup[]) {
    this.groups = groups
  }
  getGroups() {
    return this.groups
  }
  getGroupName(id: number) {
    const name = this.groups.find(g => g.id === id)?.name
    if (!name) {
      return 'Неизвестная группа'
    }
    return name
  }
  removeGroup(id: number) {
    this.setGroups(this.groups.filter(g => g.id !== id))
  }
  addGroup(group: DetailGroup) {
    this.setGroups([...this.groups, group])
  }
  updateGroup(group: DetailGroup) {
    this.setGroups(this.groups.map(g => (g.id === group.id ? group : g)))
  }
  constructor() {
    makeAutoObservable(this)
  }
  async load() {
    const groups = await rpc.metal.detailGroups.list.query()
    this.setGroups(groups)
  }
}

class MetalflowCache {
  details = new DetailCache()
  materials = new MaterialCache()
  detailGroups = new DetailGroupCache()

  constructor() {
    makeAutoObservable(this)
  }

  async init() {
    await this.details.load()
    detailListStore.updateSearchResult()

    await this.materials.load()
    await this.detailGroups.load()
  }
}

export const cache = new MetalflowCache()

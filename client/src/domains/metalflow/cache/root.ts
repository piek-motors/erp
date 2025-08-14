import { detailListStore } from 'domains/metalflow/detail/list/store'
import { makeAutoObservable } from 'mobx'
import { DetailCache } from './detail_cache'
import { DetailGroupCache } from './detail_group_cache'
import { MaterialCache } from './material_cache'

class MetalflowCache {
  details = new DetailCache()
  materials = new MaterialCache()
  detailGroups = new DetailGroupCache()

  constructor() {
    makeAutoObservable(this)
  }

  async init() {
    await this.details.load()
    detailListStore.init()
    await this.materials.load()
    await this.detailGroups.load()
  }
}

export const cache = new MetalflowCache()

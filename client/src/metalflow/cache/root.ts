import { makeAutoObservable } from 'mobx'
import { detailListStore as store } from '../details/list/store'
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
    store.search()
    await this.materials.load()
    await this.detailGroups.load()
  }
}

export const cache = new MetalflowCache()

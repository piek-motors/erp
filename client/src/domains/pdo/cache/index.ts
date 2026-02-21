import { makeAutoObservable } from 'mobx'
import { DetailCache } from './detail_cache'
import { DetailGroupCache } from './detail_group_cache'
import { MaterialCache } from './material_cache'

class MetalflowCache {
  details = new DetailCache()
  materials = new MaterialCache()
  groups = new DetailGroupCache()

  constructor() {
    makeAutoObservable(this)
  }

  async init() {
    await this.details.invalidate()
    await this.materials.invalidate()
    await this.groups.invalidate()
  }
}

export const app_cache = new MetalflowCache()

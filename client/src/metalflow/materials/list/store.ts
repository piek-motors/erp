import { EnMaterialShape } from 'domain-model'
import { AsyncStoreController } from 'lib/async-store.controller'
import { cache } from 'metalflow/metal_flow_cache'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from '../../../../../server/src/lib/trpc'
import { MaterialSupplyStore } from '../operations/supply/state'

export type MaterialListOutput =
  RouterOutput['metal']['material']['list'][number]

export class MaterialListStore {
  readonly async = new AsyncStoreController()
  supply = new MaterialSupplyStore()
  searchResult: number[] = []
  searchId: string = ''
  filterKeyword: string = ''
  filterShape?: EnMaterialShape | null
  constructor() {
    makeAutoObservable(this)
  }
  getFilteredMaterials(): MaterialListOutput[] {
    let filtered = cache.materials.getMaterials()
    if (this.searchId) {
      filtered = filtered.filter(
        material => material.id.toString() === this.searchId
      )
      return filtered
    }
    if (this.filterShape != null) {
      filtered = filtered.filter(
        material => material.shape === this.filterShape
      )
    }
    if (this.filterKeyword) {
      filtered = filtered.filter(material => {
        if (!material.label) {
          throw new Error('material.label is not specified')
        }
        return material.label
          .toLowerCase()
          .includes(this.filterKeyword.toLowerCase().trim())
      })
    }
    return filtered
  }
  search(keyword: string) {
    this.filterKeyword = keyword.toLowerCase()
    this.searchId = ''
  }
  setSearchId(id: string) {
    this.searchId = id
  }
  setFilterShape(shape?: EnMaterialShape) {
    this.filterShape = shape
  }
  clear() {
    this.filterKeyword = ''
    this.async.reset()
  }
}

export const materialListStore = new MaterialListStore()

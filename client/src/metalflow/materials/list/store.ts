import { EnMaterialShape } from 'domain-model'
import { AsyncStoreController } from 'lib/async-store.controller'
import { cache } from 'metalflow/cache/root'
import { makeAutoObservable } from 'mobx'
import { ListMaterialsOutput } from 'srv/procedures/metalflow/material/list'
import { MaterialSupplyStore } from '../warehouse/supply'

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
  getFilteredMaterials(): ListMaterialsOutput[] {
    let filtered = cache.materials.getMaterials()
    filtered = filtered.slice().sort((a, b) =>
      a.label.localeCompare(b.label, 'ru', {
        numeric: true,
        sensitivity: 'base'
      })
    )
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
  setSearchKeyword(keyword: string) {
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

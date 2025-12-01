import { cache } from 'domains/pdo/cache/root'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable } from 'mobx'
import { MaterialShape } from 'models'
import { Material } from 'srv/rpc/pdo/materials'
import { MaterialSupplyStore } from '../warehouse/supply'

export class MaterialListStore {
  readonly async = new LoadingController()
  supply = new MaterialSupplyStore()
  searchResult: number[] = []
  searchId: string = ''
  filterKeyword: string = ''
  filterShape?: MaterialShape | null
  constructor() {
    makeAutoObservable(this)
  }
  getFilteredMaterials(): Material[] {
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
  setFilterShape(shape?: MaterialShape) {
    this.filterShape = shape
  }
  clear() {
    this.filterKeyword = ''
    this.async.reset()
  }
}

export const materialListStore = new MaterialListStore()

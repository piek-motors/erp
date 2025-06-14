import { EnMaterialShape, Material } from 'domain-model'
import { AsyncStoreController } from 'lib/async-store.controller'
import { makeAutoObservable } from 'mobx'
import * as api from './material.api'

export class MaterialListStore {
  readonly async = new AsyncStoreController()

  materials: Material[] = []
  searchResult: number[] = []
  filterKeyword: string = ''
  filterShape?: EnMaterialShape | null

  constructor() {
    makeAutoObservable(this)
  }

  getFilteredMaterials(): Material[] {
    let filtered = this.materials

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
  }

  setFilterShape(shape?: EnMaterialShape) {
    this.filterShape = shape
  }

  setMaterials(materials: Material[]) {
    this.materials = materials
  }

  addMaterial(material: Material) {
    this.materials.push(material)
  }

  clear() {
    this.materials = []
    this.filterKeyword = ''
    this.async.reset()
  }

  async init() {
    return this.async.run(async () => {
      const materials = await api.getMaterials()
      this.setMaterials(materials || [])
    })
  }
}

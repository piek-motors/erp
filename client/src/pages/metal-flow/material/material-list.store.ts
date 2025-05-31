import { EnMaterialShape, Material } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { getMaterials } from './material.api'

export class MaterialListStore {
  loading: boolean = false
  error: Error | null = null

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
      console.log('filterKeyword', this.filterKeyword)
      filtered = filtered.filter(material => {
        if (!material.label) {
          throw new Error('material.label is not specified')
        }
        return material.label.toLowerCase().includes(this.filterKeyword)
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
  }

  get(id: number) {
    const m = this.materials.find(m => m.id === id)
    if (!m) throw Error('Material not found')
    return m
  }

  async fetchAll() {
    try {
      this.setLoading(true)
      const materials = await getMaterials()
      this.setMaterials(materials || [])
    } catch (error) {
      this.setError(error as Error)
    } finally {
      this.setLoading(false)
    }
  }

  private setError(error: Error) {
    this.error = error
  }

  private setLoading(loading: boolean) {
    this.loading = loading
  }
}

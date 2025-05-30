import { apolloClient } from 'api'
import { EnMaterialShape, Material } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import {
  GetMaterialsDocument,
  GetMaterialsQuery,
  GetMaterialsQueryVariables
} from 'types/graphql-shema'
import { map } from '../mappers'

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

  get filteredMaterials(): Material[] {
    if (this.filterShape == null) {
      return this.materials
    }
    return this.materials.filter(
      material => material.shape === this.filterShape
    )
  }

  search(keyword: string) {
    this.filterKeyword = keyword
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
      const res = await apolloClient.query<
        GetMaterialsQuery,
        GetMaterialsQueryVariables
      >({
        query: GetMaterialsDocument,
        fetchPolicy: 'cache-first'
      })
      const materials = res.data?.metal_flow_materials.map(map.material.fromDto)
      this.setMaterials(materials)
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

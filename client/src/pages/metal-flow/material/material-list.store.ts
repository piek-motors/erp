import { apolloClient } from 'api'
import { Material } from 'domain-model'
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

  constructor() {
    makeAutoObservable(this)
  }

  search(keyword: string) {
    this.filterKeyword = keyword
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
      this.loading = true
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
      this.error = error as Error
    } finally {
      this.loading = false
    }
  }
}

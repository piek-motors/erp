import { EnMaterialShape } from 'domain-model'
import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from '../../../../../server/src/lib/trpc'

export type MaterialLiseOutput = RouterOutput['material']['list'][number]

export class MaterialListStore {
  readonly async = new AsyncStoreController()

  materials: MaterialLiseOutput[] = []
  searchResult: number[] = []
  searchId: string = ''
  filterKeyword: string = ''
  filterShape?: EnMaterialShape | null

  constructor() {
    makeAutoObservable(this)
  }

  getFilteredMaterials(): MaterialLiseOutput[] {
    let filtered = this.materials

    if (this.searchId) {
      filtered = filtered.filter(material =>
        material.id.toString().startsWith(this.searchId)
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
  }

  setSearchId(id: string) {
    this.searchId = id
  }

  setFilterShape(shape?: EnMaterialShape) {
    this.filterShape = shape
  }

  setMaterials(materials: MaterialLiseOutput[]) {
    this.materials = materials
  }

  addMaterial(material: MaterialLiseOutput) {
    this.materials.push(material)
  }

  clear() {
    this.materials = []
    this.filterKeyword = ''
    this.async.reset()
  }

  async init() {
    return this.async.run(async () => {
      const materials = await rpc.material.list.query()
      this.setMaterials(materials)
    })
  }
}

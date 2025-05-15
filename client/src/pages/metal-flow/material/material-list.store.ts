import { makeAutoObservable } from 'mobx'
import { Material } from '../../../../../domain-model/dist'

export class MaterialListStore {
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
}

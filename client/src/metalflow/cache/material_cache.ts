import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from '../../../../server/src/lib/trpc'

export type Material = RouterOutput['metal']['material']['list'][number]

export class MaterialCache {
  private materials: Material[] = []
  setMaterials(materials: Material[]) {
    this.materials = materials
  }
  getMaterials() {
    return this.materials
  }
  removeMaterial(material: Material) {
    this.setMaterials(this.materials.filter(m => m.id !== material.id))
  }
  addMaterial(material: Material) {
    this.setMaterials([...this.materials, material])
  }
  updateMaterial(material: Material) {
    this.setMaterials(
      this.materials.map(m => (m.id === material.id ? material : m))
    )
  }
  constructor() {
    makeAutoObservable(this)
  }
  async load() {
    const materials = await rpc.metal.material.list.query()
    this.setMaterials(materials)
  }
}

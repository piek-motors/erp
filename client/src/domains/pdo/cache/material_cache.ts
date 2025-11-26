import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { rpc } from 'lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import { Material } from 'srv/rpc/pdo/material/list'

export class MaterialCache {
  private materials: Material[] = []
  setMaterials(materials: Material[]) {
    this.materials = materials
  }
  get(id: number): Material | undefined {
    return this.materials.find(material => material.id === id)
  }
  getLabel(id: number): string | null {
    const material = this.get(id)
    return material ? material.label : null
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
    const materials = await rpc.pdo.material.list.query()
    const decodedMaterials = matrixDecoder<Material>(materials)
    this.setMaterials(decodedMaterials)
  }
}

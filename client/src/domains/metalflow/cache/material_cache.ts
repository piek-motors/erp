import { matrixDecoder } from 'lib/matrix_decoder'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { ListMaterialsOutput } from 'srv/procedures/metalflow/material/list'

export class MaterialCache {
  private materials: ListMaterialsOutput[] = []
  setMaterials(materials: ListMaterialsOutput[]) {
    this.materials = materials
  }
  get(id: number): ListMaterialsOutput | undefined {
    return this.materials.find(material => material.id === id)
  }
  getLabel(id: number): string {
    const material = this.get(id)
    return material ? material.label : '＼（´Ｏ｀）／'
  }
  getMaterials() {
    return this.materials
  }
  removeMaterial(material: ListMaterialsOutput) {
    this.setMaterials(this.materials.filter(m => m.id !== material.id))
  }
  addMaterial(material: ListMaterialsOutput) {
    this.setMaterials([...this.materials, material])
  }
  updateMaterial(material: ListMaterialsOutput) {
    this.setMaterials(
      this.materials.map(m => (m.id === material.id ? material : m))
    )
  }
  constructor() {
    makeAutoObservable(this)
  }
  async load() {
    const materials = await rpc.metal.material.list.query()
    const decodedMaterials = matrixDecoder<ListMaterialsOutput>(materials)
    this.setMaterials(decodedMaterials)
  }
}

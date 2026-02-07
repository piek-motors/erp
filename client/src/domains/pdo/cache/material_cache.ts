import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { normalize } from '@/lib/utils/search'
import type { Material } from '@/server/domains/pdo/materials_rpc'
import { makeAutoObservable } from 'mobx'

export class MaterialCache {
  private materials: Material[] = []
  get(id: number): Material | undefined {
    return this.materials.find(material => material.id === id)
  }
  get_or_throw(id: number): Material {
    const m = this.materials.find(material => material.id === id)
    if (!m) throw Error(`material ${id} not found in cache`)
    return m
  }
  getLabel(id: number): string | null {
    const material = this.get(id)
    return material ? material.label : null
  }
  getMaterials() {
    return this.materials
  }
  /** for searching */
  get normalized_materials() {
    return this.materials.map(m => ({
      ...m,
      label: normalize(m.label),
    }))
  }
  removeMaterial(material: Material) {
    this.materials = this.materials.filter(m => m.id !== material.id)
  }

  constructor() {
    makeAutoObservable(this)
  }
  async invalidate() {
    const materials = await rpc.pdo.material.list.query()
    const decodedMaterials = matrixDecoder<Material>(materials)
    this.materials = decodedMaterials
  }
}

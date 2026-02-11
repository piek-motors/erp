import { makeAutoObservable } from 'mobx'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { normalize } from '@/lib/utils/search'
import type { MaterialRes } from '@/server/domains/pdo/materials_rpc'

export class MaterialCache {
  private materials: MaterialRes[] = []
  get(id: number): MaterialRes | undefined {
    return this.materials.find(material => material.id === id)
  }
  get_or_throw(id: number): MaterialRes {
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
  removeMaterial(material: MaterialRes) {
    this.materials = this.materials.filter(m => m.id !== material.id)
  }

  constructor() {
    makeAutoObservable(this)
  }
  async invalidate() {
    const materials = await rpc.pdo.material.list.query()
    const decodedMaterials = matrixDecoder<MaterialRes>(materials)
    this.materials = decodedMaterials
  }
}

import { makeAutoObservable, runInAction } from 'mobx'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { normalize } from '@/lib/utils/search'
import type { MaterialRes } from '@/server/domains/pdo/materials_rpc'

export type AppMaterial = MaterialRes & {
  // field to execute search on it
  normalized_label: string
}

export class MaterialCache {
  private _materials: AppMaterial[] = []

  constructor() {
    makeAutoObservable(this)
  }

  get(id: number): AppMaterial | undefined {
    return this._materials.find(material => material.id === id)
  }

  get_or_throw(id: number): AppMaterial {
    const m = this._materials.find(material => material.id === id)
    if (!m) throw Error(`material ${id} not found in cache`)
    return m
  }

  label_for(id: number): string | null {
    const material = this.get(id)
    return material ? material.label : null
  }

  get materials() {
    return this._materials
  }

  delete(id: number) {
    this._materials = this._materials.filter(m => m.id !== id)
  }

  async invalidate() {
    const encoded_materials = await rpc.pdo.material.list.query()
    const m = matrixDecoder<MaterialRes>(encoded_materials)
    runInAction(() => {
      this._materials = this.normalize_materials(m)
    })
  }

  private normalize_materials(m: MaterialRes[]): AppMaterial[] {
    return m.map(m => ({
      ...m,
      normalized_label: normalize(m.label),
    }))
  }
}

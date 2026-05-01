import { makeAutoObservable, runInAction, observable } from 'mobx'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { normalize } from '@/lib/utils/search'
import type { MaterialRes } from '@/server/domains/pdo/materials_rpc'

export type AppMaterial = MaterialRes & {
  // field to execute search on it
  normalized_label: string
}

export class MaterialCache {
  // Using ObservableMap for O(1) lookups and reactive updates
  private _materialsMap = observable.map<number, AppMaterial>()

  constructor() {
    makeAutoObservable(this)
  }

  /**
   * O(1) Lookup
   */
  get(id: number): AppMaterial | undefined {
    return this._materialsMap.get(id)
  }

  /**
   * O(1) Lookup with error handling
   */
  get_or_throw(id: number): AppMaterial {
    const m = this._materialsMap.get(id)
    if (!m) throw Error(`material ${id} not found in cache`)
    return m
  }

  /**
   * Fast property access
   */
  label_for(id: number): string | null {
    return this._materialsMap.get(id)?.label ?? null
  }

  /**
   * Converts Map values to an array for components requiring lists
   */
  get materials(): AppMaterial[] {
    return Array.from(this._materialsMap.values())
  }

  delete(id: number) {
    this._materialsMap.delete(id)
  }

  /**
   * Manual update/upsert helper
   */
  update(material: AppMaterial) {
    this._materialsMap.set(material.id, material)
  }

  async invalidate() {
    const encoded_materials = await rpc.pdo.material.list.query()
    const m = matrixDecoder<MaterialRes>(encoded_materials)
    const normalized = this.normalize_materials(m)

    runInAction(() => {
      this._materialsMap.clear()
      for (const item of normalized) {
        this._materialsMap.set(item.id, item)
      }
    })
  }

  private normalize_materials(m: MaterialRes[]): AppMaterial[] {
    return m.map(item => ({
      ...item,
      normalized_label: normalize(item.label),
    }))
  }
}

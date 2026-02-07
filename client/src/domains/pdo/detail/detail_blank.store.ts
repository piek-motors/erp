import { app_cache } from '@/domains/pdo/cache'
import type { Blank } from '@/server/domains/pdo/details_rpc'
import { makeAutoObservable } from 'mobx'
import { MaterialRequirement } from 'models'

export type BlankData = Exclude<Blank['material'], undefined>['data']

export class MaterialRequirementSt {
  material_id: number | null = null
  setMaterialId(materialId: number) {
    this.material_id = materialId
  }
  data: BlankData
  set_data(d: BlankData) {
    this.data = d
  }
  constructor(b?: Blank['material']) {
    this.data = {
      type: MaterialRequirement.Single,
      blank_length: null,
      gross_length: null,
    }
    if (b) {
      this.material_id = b.material_id
      this.data = b.data
    }
    makeAutoObservable(this)
  }
  get material() {
    if (!this.material_id) return null
    return app_cache.materials.get(this.material_id)
  }
}

export class DetailRequirementSt {
  detailId: number
  setDetailId(id: number) {
    this.detailId = id
  }
  qty: number | null = 1
  setQty(qty: number | null) {
    this.qty = qty
  }
  constructor(init: { detail_id?: number; qty?: number } = {}) {
    makeAutoObservable(this)
    this.detailId = init.detail_id || 0
    this.qty = init.qty || 1
  }
  get detail() {
    return app_cache.details.get(this.detailId)
  }
}

type BlankAttributes = { key: string; value: any }[]

export class DetailBlankSt {
  details_requirement: DetailRequirementSt[] = []
  material_requirement: MaterialRequirementSt | null = null
  set_material_requirement(c?: MaterialRequirementSt | null) {
    this.material_requirement = c || null
  }

  attributes: BlankAttributes = []
  set_attributes(a: BlankAttributes) {
    this.attributes = a
  }

  constructor() {
    makeAutoObservable(this)
  }

  init(blank: Blank) {
    this.details_requirement =
      blank?.details?.map(d => new DetailRequirementSt(d)) || []

    this.set_material_requirement(
      blank.material ? new MaterialRequirementSt(blank.material) : null,
    )
    if (blank.attributes) {
      this.attributes = blank.attributes
    }
  }

  get payload(): Blank {
    return {
      details: this.details_requirement
        .map(d => ({
          detail_id: d.detailId,
          qty: d.qty ?? 1,
        }))
        .filter(e => e.detail_id && e.qty),

      material:
        this.material_requirement?.data && this.material_requirement?.material
          ? {
              material_id: this.material_requirement.material.id,
              data: this.material_requirement.data,
            }
          : undefined,
      attributes: this.attributes.filter(each => each.key),
    }
  }

  reset() {
    this.details_requirement = []
    this.material_requirement = null
  }

  add_material_requirement() {
    this.material_requirement = new MaterialRequirementSt()
  }

  add_detail_requirement() {
    this.details_requirement.push(new DetailRequirementSt())
  }

  update_material_requirement(materialId: number) {
    if (!this.material_requirement) {
      this.add_material_requirement()
    }
    if (this.material_requirement) {
      this.material_requirement.material_id = materialId
    }
  }

  delete_detail_requirement(detailId: number) {
    this.details_requirement = this.details_requirement.filter(
      d => d.detailId != detailId,
    )
  }
}

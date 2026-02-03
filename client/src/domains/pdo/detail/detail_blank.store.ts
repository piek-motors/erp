import { app_cache } from 'domains/pdo/cache'
import { makeAutoObservable } from 'mobx'
import { MaterialRequirement } from 'models'
import type { Blank } from 'srv/domains/pdo/details'

export type BlankData = Exclude<Blank['material'], undefined>['data']

export class MaterialRequirementSt {
	material_id!: number
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
		}
		if (b) {
			this.material_id = b.material_id
			this.data = b.data
		}
		makeAutoObservable(this)
	}
	get material() {
		return app_cache.materials.get(this.material_id)
	}
}

export class DetailRequirementSt {
	detailId: number
	setDetailId(id: number) {
		this.detailId = id
	}
	qty?: number = 1
	setQty(qty?: number) {
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
	set_details_requirement(detailCosts?: DetailRequirementSt[]) {
		this.details_requirement = detailCosts || []
	}
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
		this.set_details_requirement(
			blank?.details?.map(d => new DetailRequirementSt(d)),
		)
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

			material: this.material_requirement?.data &&
				this.material_requirement?.material && {
					material_id: this.material_requirement.material.id,
					data: this.material_requirement.data,
				},
			attributes: this.attributes,
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
		this.set_details_requirement(
			this.details_requirement.filter(d => d.detailId !== detailId),
		)
	}
}

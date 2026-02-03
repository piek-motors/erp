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

export class DetailBlankSt {
	detailsCost: DetailRequirementSt[] = []
	setDetailCost(detailCosts?: DetailRequirementSt[]) {
		this.detailsCost = detailCosts || []
	}
	materialCost: MaterialRequirementSt | null = null
	setMaterialCost(c?: MaterialRequirementSt | null) {
		this.materialCost = c || null
	}

	constructor() {
		makeAutoObservable(this)
	}

	init(blank: Blank) {
		this.setDetailCost(blank?.details?.map(d => new DetailRequirementSt(d)))
		this.setMaterialCost(
			blank.material ? new MaterialRequirementSt(blank.material) : null,
		)
	}

	get payload(): Blank {
		return {
			details: this.detailsCost
				.map(d => ({
					detail_id: d.detailId,
					qty: d.qty ?? 1,
				}))
				.filter(e => e.detail_id && e.qty),

			material: this.materialCost?.data &&
				this.materialCost?.material && {
					material_id: this.materialCost.material.id,
					data: this.materialCost.data,
				},
		}
	}

	reset() {
		this.detailsCost = []
		this.materialCost = null
	}

	insertMaterialCost() {
		this.materialCost = new MaterialRequirementSt()
	}

	insertDetail() {
		this.detailsCost.push(new DetailRequirementSt())
	}

	updateMaterial(materialId: number) {
		if (!this.materialCost) {
			this.insertMaterialCost()
		}
		if (this.materialCost) {
			this.materialCost.material_id = materialId
		}
	}

	deleteDetail(detailId: number) {
		this.setDetailCost(this.detailsCost.filter(d => d.detailId !== detailId))
	}
}

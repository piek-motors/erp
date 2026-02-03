import { app_cache } from 'domains/pdo/cache'
import { makeAutoObservable } from 'mobx'
import { MaterialRequirement } from 'models'
import type { Blank } from 'srv/domains/pdo/details'

export type BlankData = Exclude<Blank['material'], undefined>['data']

export class MaterialCost {
	materialId!: number
	setMaterialId(materialId: number) {
		this.materialId = materialId
	}

	data?: BlankData
	set_data(d?: BlankData) {
		this.data = d
	}

	constructor(b?: Blank['material']) {
		this.data = {
			type: MaterialRequirement.Single,
		}

		if (b) {
			this.materialId = b.material_id
			this.data = b.data
		}

		makeAutoObservable(this)
	}

	get material() {
		return app_cache.materials.get(this.materialId)
	}
}

export class DetailCost {
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

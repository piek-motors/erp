import { makeAutoObservable } from 'mobx'
import type { Blank } from 'srv/domains/pdo/details'
import { DetailCost, MaterialCost } from './cost.store'

export class MetalBlankSt {
	detailsCost: DetailCost[] = []
	setDetailCost(detailCosts?: DetailCost[]) {
		this.detailsCost = detailCosts || []
	}
	materialCost: MaterialCost | null = null
	setMaterialCost(c?: MaterialCost | null) {
		this.materialCost = c || null
	}

	constructor() {
		makeAutoObservable(this)
	}

	init(blank: Blank) {
		this.setDetailCost(blank?.details?.map(d => new DetailCost(d)))
		this.setMaterialCost(
			blank.material ? new MaterialCost(blank.material) : null,
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
		this.materialCost = new MaterialCost()
	}

	insertDetail() {
		this.detailsCost.push(new DetailCost())
	}

	updateMaterial(materialId: number) {
		if (!this.materialCost) {
			this.insertMaterialCost()
		}
		if (this.materialCost) {
			this.materialCost.materialId = materialId
		}
	}

	deleteDetail(detailId: number) {
		this.setDetailCost(this.detailsCost.filter(d => d.detailId !== detailId))
	}
}

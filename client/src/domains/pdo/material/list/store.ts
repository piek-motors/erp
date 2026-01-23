import { app_cache } from 'domains/pdo/cache'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable } from 'mobx'
import type { MaterialShape } from 'models'
import type { Material } from 'srv/rpc/pdo/materials'
import { MaterialSupplySt } from '../warehouse/supply_st'

export class MaterialListStore {
	readonly async = new LoadingController()
	supply = new MaterialSupplySt()
	searchResult: number[] = []
	searchId: string = ''
	filterKeyword: string = ''
	filterShape?: MaterialShape | null
	constructor() {
		makeAutoObservable(this)
	}
	getFilteredMaterials(): Material[] {
		let filtered = app_cache.materials.getMaterials()
		filtered = filtered.slice().sort((a, b) =>
			a.label.localeCompare(b.label, 'ru', {
				numeric: true,
				sensitivity: 'base',
			}),
		)
		if (this.searchId) {
			filtered = filtered.filter(
				material => material.id.toString() === this.searchId,
			)
			return filtered
		}
		if (this.filterShape != null) {
			filtered = filtered.filter(
				material => material.shape === this.filterShape,
			)
		}
		if (this.filterKeyword) {
			filtered = filtered.filter(material => {
				if (!material.label) {
					throw new Error('material.label is not specified')
				}
				return material.label
					.toLowerCase()
					.includes(this.filterKeyword.toLowerCase().trim())
			})
		}
		return filtered
	}
	setSearchKeyword(keyword: string) {
		this.filterKeyword = keyword.toLowerCase()
		this.searchId = ''
	}
	setSearchId(id: string) {
		this.searchId = id
	}
	setFilterShape(shape?: MaterialShape) {
		this.filterShape = shape
	}
	clear() {
		this.filterKeyword = ''
		this.async.reset()
	}
}

export const materialListStore = new MaterialListStore()

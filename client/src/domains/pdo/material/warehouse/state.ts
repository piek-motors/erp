import { app_cache } from 'domains/pdo/cache'
import { makeAutoObservable } from 'mobx'
import { MaterialSupplySt } from './supply_st'
import { MaterialWriteoffSt } from './writeoff_st'

export class MaterialWarehouseStore {
	readonly supply = new MaterialSupplySt()
	readonly writeoff = new MaterialWriteoffSt()

	stock: number = 0
	setStock(val: number) {
		this.stock = val
	}

	constructor() {
		makeAutoObservable(this)
	}

	async insertSupply(materialId: number) {
		const stock = await this.supply.insertSupply(materialId)
		this.reset()
		this.setStock(stock)
		return stock
	}

	async insertWriteoff(materialId: number) {
		const stock = await this.writeoff.insertWriteoff(materialId)
		this.reset()
		this.setStock(stock)
		return stock
	}

	private reset() {
		this.supply.reset()
		this.writeoff.reset()
		app_cache.materials.invalidate()
		this.stock = 0
	}
}

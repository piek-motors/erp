import { cache } from 'domains/pdo/cache/root'
import { makeAutoObservable } from 'mobx'
import { MaterialSupplyStore } from './supply'
import { MaterialWriteoffState } from './writeoff'

export class MaterialWarehouseStore {
	readonly supply = new MaterialSupplyStore()
	readonly writeoff = new MaterialWriteoffState()

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
		cache.materials.invalidate()
		this.stock = 0
	}
}

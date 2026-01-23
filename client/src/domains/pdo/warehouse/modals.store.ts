import { makeAutoObservable } from 'mobx'

export class WarehouseModalsState {
	constructor() {
		makeAutoObservable(this)
	}
	supply = false
	writeoff = false
	setSupply(open: boolean) {
		this.supply = open
	}
	setWriteoff(open: boolean) {
		this.writeoff = open
	}
}

export const modalState = new WarehouseModalsState()

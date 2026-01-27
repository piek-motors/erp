import { makeAutoObservable, rpc } from 'lib/deps'
import { WriteoffReason } from 'models'

export class MaterialWriteoffSt {
	length = ''
	setLength(length: string) {
		this.length = length
	}
	reason: WriteoffReason = WriteoffReason.UsedInProduction
	setReason(reason: WriteoffReason) {
		this.reason = reason
	}
	constructor() {
		makeAutoObservable(this)
	}
	validate(): Error | undefined {
		if (parseFloat(this.length) === 0) {
			return new Error('Длина не указана')
		}
	}
	reset() {
		this.length = ''
	}

	disabled() {
		return this.length === '' || this.reason == null
	}
	async insertWriteoff(materialId?: number): Promise<number> {
		if (!materialId) {
			throw new Error('Material ID is not set')
		}
		const stock = await rpc.pdo.material.writeoff.mutate({
			material_id: materialId,
			lengthMeters: Number(this.length),
			reason: this.reason,
			type_data: {},
		})

		return Number(stock)
	}
}

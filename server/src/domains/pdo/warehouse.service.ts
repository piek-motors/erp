import { type IDB, TRPCError } from '#root/sdk.js'
import { OperationType, type SupplyReason, type WriteoffReason } from 'models'

export class Warehouse {
	constructor(
		private readonly trx: IDB,
		private readonly userId: number,
	) {}

	async supplyMaterial(id: number, qty: number, reason: SupplyReason) {
		const [operation, { on_hand_balance }] = await Promise.all([
			this.trx
				.insertInto('pdo.operations')
				.values({
					operation_type: OperationType.Supply,
					user_id: this.userId,
					material_id: id,
					qty,
					reason,
				})
				.returning(['id'])
				.executeTakeFirstOrThrow(),
			//
			this.trx
				.updateTable('pdo.materials')
				.set(eb => ({
					on_hand_balance: eb('on_hand_balance', '+', qty),
				}))
				.where('id', '=', id)
				.returning(['on_hand_balance'])
				.executeTakeFirstOrThrow(),
		])
		return {
			operation_id: operation.id,
			on_hand_balance,
		}
	}

	async subtractMaterial(
		id: number,
		qty: number,
		reason: WriteoffReason,
		detail_id?: number,
		manufacturing_order_id?: number,
	) {
		const current_stock = await this.trx
			.selectFrom('pdo.materials')
			.select(['on_hand_balance', 'label'])
			.where('id', '=', id)
			.executeTakeFirstOrThrow()
		if (current_stock.on_hand_balance < qty) {
			throw new ErrNotEnoughStock(
				`Недостаточно материала id=${id} ${current_stock.label}`,
			)
		}

		const operation = await this.trx
			.insertInto('pdo.operations')
			.values({
				operation_type: OperationType.Writeoff,
				user_id: this.userId,
				material_id: id,
				detail_id,
				qty,
				reason,
				manufacturing_order_id,
			})
			.returning(['id'])
			.executeTakeFirstOrThrow()

		const res = await this.trx
			.updateTable('pdo.materials')
			.set(eb => ({
				on_hand_balance: eb('on_hand_balance', '-', qty),
			}))
			.where('id', '=', id)
			.returning(['on_hand_balance'])
			.executeTakeFirstOrThrow()

		return {
			operation_id: operation.id,
			on_hand_balance: res.on_hand_balance,
		}
	}

	async supplyDetails(id: number, qty: number, reason: SupplyReason) {
		const operation = await this.trx
			.insertInto('pdo.operations')
			.values({
				operation_type: OperationType.Supply,
				user_id: this.userId,
				detail_id: id,
				qty,
				reason,
			})
			.returning(['id'])
			.executeTakeFirstOrThrow()
		const detail = await this.trx
			.updateTable('pdo.details')
			.set(eb => ({
				on_hand_balance: eb('on_hand_balance', '+', qty),
			}))
			.where('id', '=', id)
			.returning(['on_hand_balance'])
			.executeTakeFirstOrThrow()

		return {
			operation_id: operation.id,
			on_hand_balance: detail.on_hand_balance,
		}
	}

	async writeoffDetails(id: number, qty: number, reason: WriteoffReason) {
		const { on_hand_balance } = await this.trx
			.selectFrom('pdo.details')
			.select(['on_hand_balance'])
			.where('id', '=', id)
			.executeTakeFirstOrThrow()
		if (on_hand_balance < qty) {
			throw new ErrNotEnoughStock(`Недостаточно деталей ${id}`)
		}

		const detail = await this.trx
			.updateTable('pdo.details')
			.set(eb => ({
				on_hand_balance: eb('on_hand_balance', '-', qty),
			}))
			.where('id', '=', id)
			.returning(['on_hand_balance'])
			.executeTakeFirstOrThrow()

		const operation = await this.trx
			.insertInto('pdo.operations')
			.values({
				operation_type: OperationType.Writeoff,
				user_id: this.userId,
				detail_id: id,
				qty,
				reason,
			})
			.returning('id')
			.executeTakeFirstOrThrow()

		return {
			on_hand_balance: detail.on_hand_balance,
			operation_id: operation.id,
		}
	}
}

class ErrNotEnoughStock extends TRPCError {
	constructor(message: string) {
		super({
			code: 'BAD_REQUEST',
			message,
		})
	}
}

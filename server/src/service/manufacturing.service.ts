import { type IDB, TRPCError } from '#root/sdk.js'
import type { DB } from 'db'
import { Decimal } from 'decimal.js'
import type { Selectable } from 'kysely'
import { ManufacturingOrderStatus, WriteoffReason } from 'models'
import { Warehouse } from './warehouse.service.js'

type MaterialWriteoff = {
	material_id: number
	material_name: string
	writeoff_id: number
	stock: number
	totalCost: number
} | null

export class Manufacturing {
	private readonly warehouse: Warehouse

	constructor(
		private readonly trx: IDB,
		userId: number,
	) {
		this.warehouse = new Warehouse(trx, userId)
	}

	async createOrder(
		detail_id: number,
	): Promise<Selectable<DB.ProductionOrderTable>> {
		// deduplication check:  if order created some already
		const existingOrder = await this.trx
			.selectFrom('pdo.orders')
			.where('detail_id', '=', detail_id)
			.where('status', 'in', [
				ManufacturingOrderStatus.Waiting,
				ManufacturingOrderStatus.Preparation,
			])
			.select('id')
			.executeTakeFirst()
		if (existingOrder) {
			throw new ErrManufacturingOrderAlreadyExists(
				`Order for detail=${detail_id} already exists: order_id=${existingOrder.id}`,
			)
		}

		return await this.trx
			.insertInto('pdo.orders')
			.values({
				detail_id,
				qty: 0,
				finished_at: null,
				material_writeoffs: {
					writeoffs: [],
				},
				status: ManufacturingOrderStatus.Waiting,
			})
			.returningAll()
			.executeTakeFirstOrThrow()
	}

	async startMaterialPreparationPhase(
		orderId: number,
	): Promise<Selectable<DB.ProductionOrderTable>> {
		const order = await this.getOrder(orderId)
		if (order.status !== ManufacturingOrderStatus.Waiting) {
			throw new ErrForbiddenStatusTransition(
				`Manufacturing with id ${orderId} not waiting`,
			)
		}

		await this.trx
			.updateTable('pdo.orders')
			.set({ status: ManufacturingOrderStatus.Preparation })
			.where('id', '=', orderId)
			.execute()

		order.status = ManufacturingOrderStatus.Preparation
		return order
	}

	async startProductionPhase(
		orderId: number,
		qty: number,
		force?: boolean,
	): Promise<MaterialWriteoff> {
		const order = await this.getOrder(orderId)
		const detail = await this.trx
			.selectFrom('pdo.details')
			.where('id', '=', order.detail_id)
			.select('automatic_writeoff')
			.executeTakeFirstOrThrow()

		if (!force) {
			await this.deduplicateProductionList(order.detail_id)
		}

		const materialCost = detail.automatic_writeoff?.material
		let writeoff: MaterialWriteoff = null
		if (materialCost) {
			const [id, cost] = materialCost
			const material = await this.trx
				.selectFrom('pdo.materials')
				.where('id', '=', id)
				.selectAll()
				.executeTakeFirstOrThrow()

			writeoff = await this.subtractMaterials(
				{
					material_id: id,
					cost: cost,
					label: material.label,
					stock: material.stock,
				},
				qty,
				order,
			)
		}

		await this.trx
			.updateTable('pdo.orders')
			.set({
				qty,
				started_at: new Date(),
				status: ManufacturingOrderStatus.Production,
			})
			.where('id', '=', orderId)
			.execute()
		return writeoff
	}

	/** deduplication check:  if order already started production */
	private async deduplicateProductionList(detail_id: number) {
		const order = await this.trx
			.selectFrom('pdo.orders')
			.where('detail_id', '=', detail_id)
			.where('status', '=', ManufacturingOrderStatus.Production)
			.select(['id', 'qty'])
			.executeTakeFirst()

		if (order) {
			throw new TRPCError({
				code: 'CONFLICT',
				message: `Order already in production order_id=${order.id}, detail_id=${detail_id}, qty=${order.qty}`,
			})
		}
	}

	async finishOrder(orderId: number): Promise<void> {
		const manufacturing = await this.trx
			.updateTable('pdo.orders')
			.set({
				finished_at: new Date(),
				status: ManufacturingOrderStatus.Collected,
			})
			.where('id', '=', orderId)
			.returningAll()
			.executeTakeFirst()
		if (!manufacturing) {
			throw new ErrManufacturingOrderNotFound(
				`Manufacturing with id ${orderId} not found`,
			)
		}

		await this.trx
			.updateTable('pdo.details')
			.set(eb => ({
				stock: eb('stock', '+', manufacturing.qty),
			}))
			.where('id', '=', manufacturing.detail_id)
			.execute()
	}

	async deleteOrder(manufacturingId: number): Promise<void> {
		const manufacturing = await this.getOrder(manufacturingId)
		if (manufacturing.status === ManufacturingOrderStatus.Collected) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Cannot delete completed order',
			})
		}

		await this.trx
			.deleteFrom('pdo.orders')
			.where('id', '=', manufacturingId)
			.execute()
	}

	private async subtractMaterials(
		material: {
			material_id: number
			cost: number
			stock: number
			label: string
		},
		qty: number,
		order: Selectable<DB.ProductionOrderTable>,
	): Promise<MaterialWriteoff> {
		const { material_id, label, cost } = material
		if (!cost) {
			throw new Error('Не задан расход материала')
		}
		const qty_decimal = new Decimal(qty)
		if (!qty_decimal) {
			throw Error('Не задано кол-во изделий')
		}
		const totalCost = new Decimal(cost).mul(qty_decimal).toNumber()

		if (material.stock < totalCost) {
			throw new ErrNotEnoughMaterial(
				`Недостаточно материала (id=${material_id}) ${label}, требуется ${totalCost}, имеется ${material.stock}`,
			)
		}
		if (totalCost === 0) {
			throw new ErrZeroCost(
				`Не указан расход материала (id=${material_id}) ${label}`,
			)
		}

		return await this.warehouse
			.subtractMaterial(
				material.material_id,
				totalCost,
				WriteoffReason.UsedInProduction,
				order.detail_id,
				order.id,
			)
			.then(res => ({
				material_id: material.material_id,
				material_name: material.label,
				writeoff_id: res.operation_id,
				stock: res.stock,
				totalCost,
			}))
	}

	private async getOrder(
		orderId: number,
	): Promise<Selectable<DB.ProductionOrderTable>> {
		const order = await this.trx
			.selectFrom('pdo.orders')
			.where('id', '=', orderId)
			.selectAll()
			.executeTakeFirst()

		if (!order) {
			throw new ErrManufacturingOrderNotFound(
				`Manufacturing with id ${orderId} not found`,
			)
		}

		return order
	}
}

class ErrNotEnoughMaterial extends TRPCError {
	constructor(message: string) {
		super({
			code: 'BAD_REQUEST',
			message,
		})
	}
}

class ErrZeroCost extends TRPCError {
	constructor(message: string) {
		super({
			code: 'BAD_REQUEST',
			message,
		})
	}
}

class ErrManufacturingOrderNotFound extends TRPCError {
	constructor(message: string) {
		super({
			code: 'NOT_FOUND',
			message,
		})
	}
}

class ErrForbiddenStatusTransition extends TRPCError {
	constructor(message: string) {
		super({
			code: 'BAD_REQUEST',
			message,
		})
	}
}

class ErrManufacturingOrderAlreadyExists extends TRPCError {
	constructor(message: string) {
		super({
			code: 'BAD_REQUEST',
			message,
		})
	}
}

import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	const orders = await db
		.selectFrom('orders.orders as o')
		.select(['o.id', 'o.total_amount'])
		.where('o.created_at', '<', new Date('2025-05-22T00:00:00.000Z'))
		.execute()
	for (const order of orders) {
		const payments = await db
			.selectFrom('orders.order_payments')
			.selectAll()
			.where('order_id', '=', order.id)
			.orderBy('id', 'desc')
			.execute()

		if (payments.length < 2) {
			continue
		}
		await db
			.deleteFrom('orders.order_payments')
			.where(
				'id',
				'in',
				payments.slice(1).map(it => it.id),
			)
			.execute()
	}
}

export async function down(db: KDB): Promise<void> {}

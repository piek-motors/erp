import { ManufacturingOrderStatus } from 'models'
import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.materials')
    .addColumn('shortage_prediction_horizon_days', 'smallint', b =>
      b.notNull().defaultTo(60),
    )
    .execute()

  await db.schema
    .alterTable('pdo.materials')
    .dropColumn('safety_stock')
    .execute()

  const orders = await db
    .selectFrom('pdo.orders')
    .select(['id', 'qty'])
    .where('output_qty', 'is', null)
    .where('status', 'in', [
      ManufacturingOrderStatus.Collected,
      ManufacturingOrderStatus.Production,
    ])
    .execute()

  console.log(`should set output qty for ${orders.length}`)

  for (const order of orders) {
    await db
      .updateTable('pdo.orders')
      .set({ output_qty: order.qty })
      .where('id', '=', order.id)
      .execute()
  }
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.materials')
    .dropColumn('shortage_prediction_horizon_days')
    .execute()
}

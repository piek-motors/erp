import { sql } from 'kysely'
import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await sql`CREATE INDEX idx_orders_status ON orders.orders USING HASH (status)`.execute(
		db,
	)
	await sql`CREATE INDEX idx_orders_invoice_number ON orders.orders (invoice_number)`.execute(
		db,
	)
	await sql`CREATE INDEX idx_orders_contractor ON orders.orders USING HASH (contractor)`.execute(
		db,
	)
}

export async function down(db: KDB): Promise<void> {
	await sql`DROP INDEX IF EXISTS orders.idx_orders_status`.execute(db)
	await sql`DROP INDEX IF EXISTS orders.idx_orders_invoice_number`.execute(db)
	await sql`DROP INDEX IF EXISTS orders.idx_orders_contractor`.execute(db)
}

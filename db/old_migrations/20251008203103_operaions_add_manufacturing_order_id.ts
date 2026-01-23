import { sql } from 'kysely'
import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await sql`
  ALTER TABLE pdo.operations
  ADD COLUMN manufacturing_order_id INTEGER REFERENCES pdo.manufacturing(id)
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
	await sql`
  ALTER TABLE pdo.operations
  DROP COLUMN manufacturing_order_id
  `.execute(db)
}

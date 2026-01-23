import { sql } from 'kysely'
import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await sql`
    ALTER TABLE pdo.details
    ADD COLUMN updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
	await sql`
    ALTER TABLE pdo.details
    DROP COLUMN updated_at
  `.execute(db)
}

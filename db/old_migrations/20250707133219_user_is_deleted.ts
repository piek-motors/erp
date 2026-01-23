import { sql } from 'kysely'
import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await sql`
    ALTER TABLE users
    ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
	await sql`
    ALTER TABLE users
    DROP COLUMN is_deleted;
  `.execute(db)
}

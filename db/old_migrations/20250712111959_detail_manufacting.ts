import { sql } from 'kysely'
import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await sql`
    ALTER TABLE pdo.manufacturing
    ALTER COLUMN finished_at DROP NOT NULL;
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {}

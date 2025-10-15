import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE pdo.manufacturing
    ADD COLUMN status integer NOT NULL DEFAULT 0
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE pdo.manufacturing
    DROP COLUMN status
  `.execute(db)
}

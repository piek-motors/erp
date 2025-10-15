import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
    CREATE INDEX idx_details_logical_group_id ON pdo.details USING HASH (logical_group_id)
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {}

import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`DROP INDEX pdo.detail_name_unique_idx`.execute(db)
}

export async function down(db: KDB): Promise<void> {}

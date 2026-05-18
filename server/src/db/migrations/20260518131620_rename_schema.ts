import { sql } from 'kysely'
import type { KDB } from '../../db/index.js'

export async function up(db: KDB): Promise<void> {
  await sql`ALTER SCHEMA attendance RENAME TO hr`.execute(db)
}

export async function down(db: KDB): Promise<void> {}

import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`ALTER TABLE pdo.details ADD COLUMN description TEXT`.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`ALTER TABLE pdo.details DROP COLUMN description`.execute(db)
}

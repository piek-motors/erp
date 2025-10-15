import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`ALTER TABLE metal_flow.details ADD COLUMN description TEXT`.execute(
    db
  )
}

export async function down(db: KDB): Promise<void> {
  await sql`ALTER TABLE metal_flow.details DROP COLUMN description`.execute(db)
}

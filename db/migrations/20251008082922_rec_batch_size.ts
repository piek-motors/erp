import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
  ALTER TABLE metal_flow.details
  ADD COLUMN recommended_batch_size integer
  `.execute(db)

  await sql`
  ALTER TABLE metal_flow.details
  RENAME COLUMN params TO blank_spec
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {}

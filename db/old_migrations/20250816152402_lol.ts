import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE metal_flow.materials
    ADD COLUMN safety_stock numeric
  `.execute(db)

  await sql`
    ALTER TABLE metal_flow.details
    ADD COLUMN unit integer NOT NULL DEFAULT 4
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE metal_flow.materials
    DROP COLUMN safety_stock
  `.execute(db)

  await sql`
    ALTER TABLE metal_flow.details
    DROP COLUMN unit
  `.execute(db)
}

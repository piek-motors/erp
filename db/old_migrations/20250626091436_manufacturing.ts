import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
    CREATE TABLE metal_flow.manufacturing (
      id SERIAL PRIMARY KEY,
      detail_id INTEGER NOT NULL REFERENCES metal_flow.details(id),
      qty INTEGER NOT NULL,
      finished_at TIMESTAMP NOT NULL,
      started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`
    DROP TABLE metal_flow.manufacturing
  `.execute(db)
}

import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
    CREATE TABLE metal_flow.detail_group_color_annotations (
      group_id integer NOT NULL REFERENCES metal_flow.detail_group(id) ON DELETE CASCADE,
      detail_id integer NOT NULL REFERENCES metal_flow.details(id) ON DELETE CASCADE,
      colors integer[] NOT NULL,
      PRIMARY KEY (group_id, detail_id)
    )
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`
    DROP TABLE metal_flow.detail_group_color_annotations
 `.execute(db)
}

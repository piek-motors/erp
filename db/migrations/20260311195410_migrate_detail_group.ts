import { sql } from 'kysely'
import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  // Migrate existing logical_group_id values to detail_group_details table
  await sql`
    INSERT INTO pdo.detail_group_details (detail_id, group_id)
    SELECT id, logical_group_id
    FROM pdo.details
    WHERE logical_group_id IS NOT NULL
    ON CONFLICT (detail_id, group_id) DO NOTHING
  `.execute(db)

  // Drop the logical_group_id column from details table
  await sql`
    ALTER TABLE pdo.details
    DROP COLUMN IF EXISTS logical_group_id
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  // Add back the logical_group_id column
  await sql`
    ALTER TABLE pdo.details
    ADD COLUMN IF NOT EXISTS logical_group_id INTEGER
  `.execute(db)
}

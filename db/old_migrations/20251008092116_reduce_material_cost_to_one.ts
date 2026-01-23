import { sql } from 'kysely'
import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await sql`DROP TABLE IF EXISTS pdo.detail_materials`.execute(db)

	// Transform materials array to single material object
	await sql`
    UPDATE pdo.details
    SET automatic_writeoff = 
      CASE 
        WHEN automatic_writeoff->'materials' IS NOT NULL 
          AND jsonb_array_length(automatic_writeoff->'materials') > 0
        THEN (automatic_writeoff - 'materials') || jsonb_build_object('material', automatic_writeoff->'materials'->0)
        ELSE automatic_writeoff - 'materials'
      END
    WHERE automatic_writeoff IS NOT NULL
      AND automatic_writeoff ? 'materials'
  `.execute(db)

	// Create index for efficient material_id lookups
	await sql`
    CREATE INDEX idx_details_automatic_writeoff_material_id 
    ON pdo.details 
    USING btree (((automatic_writeoff->'material'->>'material_id')::int))
    WHERE automatic_writeoff->'material' IS NOT NULL
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
	// Drop the index
	await sql`
    DROP INDEX pdo.idx_details_automatic_writeoff_material_id
  `.execute(db)

	// Transform single material object back to materials array
	await sql`
    UPDATE pdo.details
    SET automatic_writeoff = 
      CASE 
        WHEN automatic_writeoff->'material' IS NOT NULL
        THEN (automatic_writeoff - 'material') || jsonb_build_object('materials', jsonb_build_array(automatic_writeoff->'material'))
        ELSE automatic_writeoff - 'material'
      END
    WHERE automatic_writeoff IS NOT NULL
      AND automatic_writeoff ? 'material'
  `.execute(db)
}

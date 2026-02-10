import { sql } from 'kysely'
import { type KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await sql`
   UPDATE pdo.details
  SET processing_route = jsonb_build_object(
    'workflow',
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_array(step::int))
        FROM jsonb_array_elements_text(processing_route->'steps') AS step
      ),
      '[]'::jsonb
    )
  )
  WHERE processing_route IS NOT NULL
    AND processing_route ? 'steps'
    `.execute(db)

  await db.schema
    .alterTable('pdo.details')
    .renameColumn('processing_route', 'workflow')
    .execute()
}

export async function down(db: KDB): Promise<void> {}

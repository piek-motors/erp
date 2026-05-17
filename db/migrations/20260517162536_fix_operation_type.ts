import { sql } from 'kysely'
import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  // 1. Convert the ENUM to SMALLINT by casting the text value directly to an integer
  await db.schema
    .alterTable('pdo.operations')
    .alterColumn('operation_type', ac =>
      ac.setDataType(sql`smallint USING operation_type::text::smallint`),
    )
    .execute()

  await sql`DROP TYPE IF EXISTS pdo.operation_type`.execute(db)
}

export async function down(): Promise<void> {}

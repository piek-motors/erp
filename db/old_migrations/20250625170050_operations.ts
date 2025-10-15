import { sql } from 'kysely'
import { type KDB } from '../schema'
export async function up(db: KDB): Promise<void> {
  await db.schema
    .createType('metal_flow.operation_type')
    .asEnum(['0', '1'])
    .execute()

  await sql`
  CREATE TABLE metal_flow.operations (
    id SERIAL PRIMARY KEY,
    operation_type metal_flow.operation_type NOT NULL,
    material_id INTEGER REFERENCES metal_flow.materials(id),
    detail_id INTEGER REFERENCES metal_flow.details(id),
    qty NUMERIC NOT NULL,
    data JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL
  )`.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`
  DROP TABLE metal_flow.operations;
  DROP TYPE metal_flow.operation_type;
  `.execute(db)
}

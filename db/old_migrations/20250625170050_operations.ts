import { sql } from 'kysely'
import type { KDB } from '../schema'
export async function up(db: KDB): Promise<void> {
	await db.schema.createType('pdo.operation_type').asEnum(['0', '1']).execute()

	await sql`
  CREATE TABLE pdo.operations (
    id SERIAL PRIMARY KEY,
    operation_type pdo.operation_type NOT NULL,
    material_id INTEGER REFERENCES pdo.materials(id),
    detail_id INTEGER REFERENCES pdo.details(id),
    qty NUMERIC NOT NULL,
    data JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL
  )`.execute(db)
}

export async function down(db: KDB): Promise<void> {
	await sql`
  DROP TABLE pdo.operations;
  DROP TYPE pdo.operation_type;
  `.execute(db)
}

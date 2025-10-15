import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
    CREATE TABLE pdo.manufacturing (
      id SERIAL PRIMARY KEY,
      detail_id INTEGER NOT NULL REFERENCES pdo.details(id),
      qty INTEGER NOT NULL,
      finished_at TIMESTAMP NOT NULL,
      started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`
    DROP TABLE pdo.manufacturing
  `.execute(db)
}

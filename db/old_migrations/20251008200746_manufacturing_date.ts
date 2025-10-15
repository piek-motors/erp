import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
  ALTER TABLE pdo.manufacturing 
  RENAME COLUMN started_at TO created_at
  `.execute(db)

  await sql`
  ALTER TABLE pdo.manufacturing 
  ADD COLUMN started_at timestamp
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {}

import { type KDB } from '../schema'
import { sql } from 'kysely'

export async function up(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE attendance.users RENAME TO employees;
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE attendance.employees RENAME TO users;
  `.execute(db)
}

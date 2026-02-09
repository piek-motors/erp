import { sql } from 'kysely'
import { Unit } from 'models'
import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await sql`
    UPDATE pdo.materials
    SET unit = ${Unit.M}
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {}

import { sql } from 'kysely'
import { Unit } from 'shared'
import type { KDB } from '../schema/index.js'

export async function up(db: KDB): Promise<void> {
  await sql`
    UPDATE pdo.materials
    SET unit = ${Unit.M}
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {}

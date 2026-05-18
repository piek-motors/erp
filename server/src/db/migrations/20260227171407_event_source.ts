import type { KDB } from '../schema/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('hr.events')
    .addColumn('origin', 'smallint')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.alterTable('hr.events').dropColumn('origin').execute()
}

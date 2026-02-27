import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('attendance.events')
    .addColumn('origin', 'smallint')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.alterTable('attendance.events').dropColumn('origin').execute()
}

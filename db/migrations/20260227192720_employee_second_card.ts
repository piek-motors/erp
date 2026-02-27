import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('attendance.employees')
    .addColumn('access_card', 'text')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('attendance.employees')
    .dropColumn('access_card')
    .execute()
}

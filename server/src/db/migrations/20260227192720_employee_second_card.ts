import type { KDB } from '../schema/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('hr.employees')
    .addColumn('access_card', 'text')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.alterTable('hr.employees').dropColumn('access_card').execute()
}

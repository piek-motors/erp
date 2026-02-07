import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('attendance.employees')
    .addColumn('job_title', 'text')
    .execute()
  await db.schema
    .alterTable('pdo.orders')
    .addColumn('priority', 'smallint', eb => eb.defaultTo(1))
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('attendance.employees')
    .dropColumn('job_title')
    .execute()
  await db.schema.alterTable('pdo.orders').dropColumn('priority').execute()
}

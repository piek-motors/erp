import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('attendance.events')
    .addColumn('employee_id', 'smallint', r =>
      r.references('attendance.employees.id').onDelete('cascade'),
    )
    .execute()
  await db.schema
    .alterTable('attendance.intervals')
    .addColumn('employee_id', 'smallint', r =>
      r.references('attendance.employees.id').onDelete('cascade'),
    )
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('attendance.events')
    .dropColumn('employee_id')
    .execute()
  await db.schema
    .alterTable('attendance.intervals')
    .dropColumn('employee_id')
    .execute()
}

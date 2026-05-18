import type { KDB } from '../schema/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('hr.events')
    .addColumn('employee_id', 'smallint', r =>
      r.references('hr.employees.id').onDelete('cascade'),
    )
    .execute()
  await db.schema
    .alterTable('hr.intervals')
    .addColumn('employee_id', 'smallint', r =>
      r.references('hr.employees.id').onDelete('cascade'),
    )
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.alterTable('hr.events').dropColumn('employee_id').execute()
  await db.schema.alterTable('hr.intervals').dropColumn('employee_id').execute()
}

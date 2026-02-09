import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .createTable('attendance.employee_absences')
    .addColumn('user_id', 'integer')
    .addColumn('date', 'date')
    .addColumn('reason', 'varchar(1)')
    .addPrimaryKeyConstraint('employee_absences_pk', ['user_id', 'date'])
    .execute()

  await db.schema
    .createIndex('employee_absences_date_idx')
    .on('attendance.employee_absences')
    .column('date')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.dropTable('attendance.employee_absences').execute()
}

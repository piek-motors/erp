import type { KDB } from '../../db/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('hr.intervals')
    .alterColumn('employee_id', col => col.setDataType('integer'))
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('hr.intervals')
    .alterColumn('employee_id', col => col.setDataType('smallint'))
    .execute()
}

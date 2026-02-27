import { sql } from 'kysely'
import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  // 2️⃣ Populate employee_id for intervals
  await db
    .updateTable('attendance.intervals as i')
    .set({
      employee_id: sql`empl.id`,
    })
    .from('attendance.employees as empl')
    .whereRef('i.card', '=', 'empl.card')
    .execute()

  // 4️⃣ Delete orphan intervals
  await db
    .deleteFrom('attendance.intervals')
    .where('employee_id', 'is', null)
    .execute()

  // 5️⃣ Make columns NOT NULL
  await db.schema
    .alterTable('attendance.events')
    .alterColumn('employee_id', col => col.setNotNull())
    .execute()

  await db.schema
    .alterTable('attendance.intervals')
    .alterColumn('employee_id', col => col.setNotNull())
    .execute()

  console.log('employee_id enforced as NOT NULL')
}

export async function down(db: KDB): Promise<void> {}

import type { Insertable } from 'kysely'
import { type DB, db } from '#root/sdk.js'

export interface Period {
  month: number
  year: number
}

export class HrRepo {
  async get_report_data(period: Period) {
    const startDate = new Date(
      Date.UTC(Number(period.year), Number(period.month), 1, 0, 0, 0),
    )
    const endDate = new Date(
      Date.UTC(Number(period.year), Number(period.month) + 1, 1, 0, 0, 0),
    )

    const [all_intervals, employees, all_absence_reasons] = await Promise.all([
      db
        .selectFrom('attendance.intervals')
        .selectAll()
        .where('ent', '>=', startDate)
        .where('ent', '<', endDate)
        .execute(),
      db.selectFrom('attendance.employees').selectAll().execute(),
      db
        .selectFrom('attendance.employee_absences')
        .selectAll()
        .where('date', '>=', startDate.toISOString().split('T')[0])
        .where('date', '<=', endDate.toISOString().split('T')[0])
        .execute(),
    ])

    return { all_intervals, employees, all_absence_reasons }
  }

  async upsert_intervals(
    intervals: DB.AttendanceIntervalTable[],
  ): Promise<number> {
    const res = await db
      .insertInto('attendance.intervals')
      .values(intervals)
      .onConflict(oc =>
        oc
          .column('ent_event_id')
          // On duplicate ent_event_id, overwrite ext fields with incoming values
          .doUpdateSet({
            ext: eb => eb.ref('excluded.ext'),
            ext_event_id: eb => eb.ref('excluded.ext_event_id'),
          })
          // But only update if ALL of the following conditions are met:
          .where(eb =>
            eb.and([
              // 1. The existing row was not yet linked to an external source
              eb('attendance.intervals.ext', 'is', null),
              // 2. The existing row was not manually edited by a user (protect manual changes)
              eb('attendance.intervals.updated_manually', 'is', null),
              // 3. At least one incoming value is actually different from what's stored
              //    (skip the update if nothing would change — NULL-safe comparison)
              eb.or([
                eb(
                  'attendance.intervals.ext',
                  'is distinct from',
                  eb.ref('excluded.ext'),
                ),
                eb(
                  'attendance.intervals.ext_event_id',
                  'is distinct from',
                  eb.ref('excluded.ext_event_id'),
                ),
              ]),
            ]),
          ),
      )
      .executeTakeFirstOrThrow()
    return Number(res.numInsertedOrUpdatedRows ?? 0)
  }

  async upsert_events(
    events: Insertable<DB.AttendanceEventsTable>[],
  ): Promise<number> {
    const events_insert_res = await db
      .insertInto('attendance.events')
      .values(events)
      .onConflict(oc => oc.columns(['card', 'timestamp']).doNothing())
      .executeTakeFirst()

    return Number(events_insert_res.numInsertedOrUpdatedRows ?? 0)
  }

  async upsert_employees(
    employees: Insertable<DB.AttendanceEmployeeTable>[],
  ): Promise<number> {
    if (!employees) return 0
    const employees_insert_res = await db
      .insertInto('attendance.employees')
      .values(employees)
      .onConflict(oc =>
        oc
          .column('card')
          .doUpdateSet({
            firstname: eb => eb.ref('excluded.firstname'),
            lastname: eb => eb.ref('excluded.lastname'),
          })
          .where(eb =>
            eb.or([
              eb(
                'attendance.employees.firstname',
                'is distinct from',
                eb.ref('excluded.firstname'),
              ),
              eb(
                'attendance.employees.lastname',
                'is distinct from',
                eb.ref('excluded.lastname'),
              ),
            ]),
          ),
      )
      .executeTakeFirstOrThrow()

    return Number(employees_insert_res.numInsertedOrUpdatedRows ?? 0)
  }

  async employees_card_index() {
    const employees = await db
      .selectFrom('attendance.employees')
      .select(['id', 'card'])
      .execute()
    return employees.reduce(
      (acc, empl) => acc.set(empl.card, empl.id),
      new Map<string, number>(),
    )
  }

  async employees_employee_id_index() {
    const employees = await db
      .selectFrom('attendance.employees')
      .select(['id', 'card'])
      .execute()
    return employees.reduce(
      (acc, empl) => acc.set(empl.id, empl.card),
      new Map<number, string>(),
    )
  }
}

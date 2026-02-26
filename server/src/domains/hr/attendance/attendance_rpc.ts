import type { Insertable } from 'kysely'
import { AbsenceReason } from 'models'
import { z } from 'zod'
import { attendanceReportGenerator } from '#root/ioc/index.js'
import { router } from '#root/lib/trpc/trpc.js'
import { type DB, db, procedure, requireScope, Scope } from '#root/sdk.js'
import { AttendanceEventPairing } from './event_pairing.js'
import { HrRepo } from './hr.repo.js'

const manual_interval_update_dto = z.object({
  ent_event_id: z.number(),
  ent: z.string(),
  ext: z.string(),
})

const upload_data_dto = z.object({
  employees: z.array(
    z.tuple([
      z.string(), // firstname
      z.string(), // lastname
      z.string(), // card
    ]),
  ),
  events: z.array(
    z.tuple([
      z.number(), // id
      z
        .string()
        .nonempty(), // card
      z
        .number()
        .int()
        .nonnegative(), // ts
    ]),
  ),
})

export const attendance = router({
  get_report: procedure
    .input(
      z.object({
        month: z.number().min(0).max(11),
        year: z.number().min(2010),
        timeRetentionMinutes: z.number().min(0),
        showFullInfo: z.boolean(),
      }),
    )
    .query(async ({ input }) =>
      attendanceReportGenerator.generateReport({
        period: {
          month: input.month,
          year: input.year,
        },
        showFullInfo: input.showFullInfo,
        timeRetentionMinutes: input.timeRetentionMinutes,
      }),
    ),
  //
  insert_interval: procedure
    .use(requireScope(Scope.hr))
    .input(
      manual_interval_update_dto.extend({
        card: z.string(),
        employee_id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return db
        .insertInto('attendance.intervals')
        .values({
          employee_id: input.employee_id,
          card: input.card,
          ent_event_id: input.ent_event_id,
          ent: new Date(input.ent),
          ext: new Date(input.ext),
          updated_manually: true,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    }),
  //
  update_interval: procedure
    .use(requireScope(Scope.hr))
    .input(manual_interval_update_dto)
    .mutation(async ({ input }) => {
      const interval = await db
        .updateTable('attendance.intervals')
        .set({
          ent: new Date(input.ent),
          ext: new Date(input.ext),
          updated_manually: true,
        })
        .where('ent_event_id', '=', input.ent_event_id)
        .executeTakeFirstOrThrow()
      if (interval.numUpdatedRows === 0n) {
        throw Error('failed to update interval: not found')
      }
      return true
    }),
  //
  set_absence_reason: procedure
    .use(requireScope(Scope.hr))
    .input(
      z.object({
        user_id: z.number(),
        date: z.string(),
        reason: z.enum(AbsenceReason),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .insertInto('attendance.employee_absences')
        .values(input)
        .onConflict(b => b.columns(['user_id', 'date']).doUpdateSet(input))
        .execute()
    }),
  //
  upload_data: procedure
    .use(requireScope('sync_timeformers:upload'))
    .input(upload_data_dto)
    .mutation(async ({ input }) => {
      const repo = new HrRepo()

      const employeesInsertedOrUpdatedRows = await repo.upsert_employees(
        input.employees.map(e => ({
          firstname: e[0],
          lastname: e[1],
          card: e[2],
        })),
      )
      const employees_card_index = await repo.employees_card_index()

      const events: Array<
        Insertable<DB.AttendanceEventsTable> & { employee_id: number }
      > = []

      for (const event of input.events) {
        const employee_id = employees_card_index.get(event[1])
        if (!employee_id) continue

        events.push({
          id: event[0],
          card: event[1],
          employee_id,
          timestamp: new Date(event[2] * 1000),
        })
      }

      const eventsInsertedOrUpdatedRows = await repo.upsert_events(events)

      await new AttendanceEventPairing().run(events)
      return {
        event_insertions: eventsInsertedOrUpdatedRows,
        employee_updates: Number(employeesInsertedOrUpdatedRows),
      }
    }),
})

import type { Insertable } from 'kysely'
import { AbsenceReason, EventOrigin } from 'models'
import { z } from 'zod'
import { attendanceReportGenerator } from '#root/ioc/index.js'
import { createDateAsUTC } from '#root/lib/time.js'
import { router } from '#root/lib/trpc/trpc.js'
import { type DB, db, procedure, requireScope, Scope, sql } from '#root/sdk.js'
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
      }),
    )
    .query(async ({ input }) =>
      attendanceReportGenerator.generateReport({
        period: {
          month: input.month,
          year: input.year,
        },
        timeRetentionMinutes: input.timeRetentionMinutes,
      }),
    ),
  //
  get_employee_events: procedure
    .input(
      z.object({
        cards: z.array(z.string()),
        date: z.string(),
      }),
    )
    .query(({ input }) => {
      console.log(input)

      return db
        .selectFrom('attendance.events')
        .select(['id', 'timestamp'])
        .where('card', 'in', input.cards)
        .where(sql<any>`timestamp::date = ${input.date.slice(0, 10)}::date`)
        .execute()
    }),
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
      const events: Array<Insertable<DB.AttendanceEventsTable>> =
        input.events.map(([card, ts]) => ({
          card,
          timestamp: createDateAsUTC(new Date(ts * 1000)),
        }))
      const eventsInsertedOrUpdatedRows = await repo.upsert_events(events)

      // run hmm
      const cutoffDate = new Date()
      cutoffDate.setMonth(cutoffDate.getMonth() - 2)

      const hmm_input_events_raw = await db
        .selectFrom('attendance.events')
        .selectAll()
        .where('timestamp', '>=', cutoffDate)
        .where('origin', '=', EventOrigin.TimeTrackingStation)
        .orderBy('timestamp', 'asc')
        .execute()

      const card_employee_id_index = await repo.employees_card_index()

      const hmm_input_events = hmm_input_events_raw
        .map(event => {
          const employee_id = card_employee_id_index.get(event.card)
          if (!employee_id) return null
          return {
            ...event,
            employee_id,
          }
        })
        .filter((e): e is NonNullable<typeof e> => e !== null)

      const intervals_upserts = await new AttendanceEventPairing().run(
        hmm_input_events,
      )
      return {
        event_inserts: eventsInsertedOrUpdatedRows,
        employee_upserts: Number(employeesInsertedOrUpdatedRows),
        intervals_upserts,
      }
    }),
})

import type { Insertable } from 'kysely'
import { AbsenceReason } from 'models'
import { z } from 'zod'
import { attendanceReportGenerator } from '#root/ioc/index.js'
import { router } from '#root/lib/trpc/trpc.js'
import { type DB, db, procedure, requireScope, Scope } from '#root/sdk.js'
import { AttendanceEventPairing } from './event_pairing_job.js'

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
    .input(manual_interval_update_dto.extend({ card: z.string() }))
    .mutation(async ({ input }) => {
      return db
        .insertInto('attendance.intervals')
        .values({
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
      const employees_insert_res = await db
        .insertInto('attendance.employees')
        .values(
          input.employees.map(e => ({
            firstname: e[0],
            lastname: e[1],
            card: e[2],
          })),
        )
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
        .executeTakeFirst()

      const events = input.events.map(
        event =>
          ({
            id: event[0],
            card: event[1],
            timestamp: new Date(event[2] * 1000),
          }) satisfies Insertable<DB.AttendanceEventsTable>,
      )

      const events_insert_res = await db
        .insertInto('attendance.events')
        .values(events)
        .onConflict(oc => oc.column('id').doNothing())
        .executeTakeFirst()

      await new AttendanceEventPairing().run(events)
      return {
        event_insertions: Number(events_insert_res.numInsertedOrUpdatedRows),
        employee_updates: Number(employees_insert_res.numInsertedOrUpdatedRows),
      }
    }),
})

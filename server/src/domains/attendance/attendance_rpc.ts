import { attendanceReportGenerator } from '#root/ioc/index.js'
import { router } from '#root/lib/trpc/trpc.js'
import { db, procedure, requireScope, Scope } from '#root/sdk.js'
import { AbsenceReason } from 'models'
import { z } from 'zod'

const intervalUpdate = z.object({
	ent_event_id: z.number(),
	ent: z.string(),
	ext: z.string(),
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
		.use(requireScope(Scope.staff))
		.input(intervalUpdate.extend({ card: z.string() }))
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
		.use(requireScope(Scope.staff))
		.input(intervalUpdate)
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
		.use(requireScope(Scope.staff))
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
})

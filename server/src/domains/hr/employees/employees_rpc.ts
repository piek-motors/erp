import { z } from 'zod'
import { db, procedure, requireScope, router, Scope } from '#root/sdk.js'

export const employees = router({
  list: procedure.query(async () =>
    db
      .selectFrom('attendance.employees')
      .selectAll()
      .orderBy('lastname')
      .execute(),
  ),
  //
  get_job_titles: procedure.query(async () => {
    const result = await db
      .selectFrom('attendance.employees')
      .select('job_title')
      .where('job_title', 'is not', null)
      .where('job_title', '!=', '')
      .distinct()
      .orderBy('job_title')
      .execute()
    return result.map(r => r.job_title as string)
  }),
  //
  update_job_title: procedure
    .use(requireScope(Scope.hr))
    .input(
      z.object({
        id: z.number(),
        job_title: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .updateTable('attendance.employees')
        .set({ job_title: input.job_title })
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow()

      if (result.numUpdatedRows === 0n) {
        throw new Error('Failed to update job title: employee not found')
      }

      return { success: true }
    }),
})

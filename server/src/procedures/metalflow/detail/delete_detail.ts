import { db, procedure, z } from '../../../deps.ts'

export const deleteDetailProcedure = procedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    await db
      .deleteFrom('metal_flow.details')
      .where('id', '=', input.id)
      .execute()
  })

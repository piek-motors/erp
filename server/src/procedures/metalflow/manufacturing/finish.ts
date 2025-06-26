import { db, publicProcedure, z } from '#root/deps.js'

export const finishManufacturing = publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    return await db
      .updateTable('metal_flow.manufacturing')
      .set({ finished_at: new Date() })
      .where('id', '=', input.id)
      .execute()
  })

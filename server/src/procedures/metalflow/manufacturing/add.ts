import { db, publicProcedure, z } from '#root/deps.js'

export const addDetailIntoManufacturingList = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      qty: z.number()
    })
  )
  .mutation(async ({ input }) => {
    return await db
      .insertInto('metal_flow.manufacturing')
      .values({
        detail_id: input.detailId,
        qty: input.qty,
        finished_at: null
      })
      .execute()
  })

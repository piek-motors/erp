import { db, publicProcedure, z } from '#root/deps.js'

export const finishManufacturing = publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const manufacturing = await db
      .updateTable('metal_flow.manufacturing')
      .set({ finished_at: new Date() })
      .where('id', '=', input.id)
      .returningAll()
      .executeTakeFirst()
    if (!manufacturing) throw new Error('Manufacturing not found')

    await db
      .updateTable('metal_flow.details')
      .set(eb => ({
        stock: eb('stock', '+', manufacturing.qty)
      }))
      .where('id', '=', manufacturing.detail_id)
      .execute()

    return 'ok'
  })

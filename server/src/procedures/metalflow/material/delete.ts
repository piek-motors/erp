import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const deleteMaterial = publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const { id } = input
    await db.transaction().execute(async trx => {
      await trx
        .deleteFrom('metal_flow.materials')
        .where('id', '=', id)
        .execute()
      await trx
        .deleteFrom('metal_flow.detail_materials')
        .where('material_id', '=', id)
        .execute()
    })

    return {
      success: true
    }
  })

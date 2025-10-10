import { db, publicProcedure, z } from '#root/deps.js'
import { Manufacturing } from '#root/service/manufacturing.service.js'

export const startMaterialPreparationPhase = publicProcedure
  .input(z.object({ orderId: z.number() }))
  .mutation(async ({ input, ctx }) => {
    return await db.transaction().execute(async trx => {
      const manufacturing = new Manufacturing(trx, ctx.user.id)
      await manufacturing.startMaterialPreparationPhase(input.orderId)
      return {
        success: true
      }
    })
  })

import { db, publicProcedure, z } from '#root/deps.js'
import { Manufacturing } from '#root/service/manufacturing.service.js'

export const startProductionPhase = publicProcedure
  .input(
    z.object({
      orderId: z.number(),
      qty: z.number(),
      force: z.boolean().optional()
    })
  )
  .mutation(async ({ input, ctx }) => {
    return await db.transaction().execute(async trx => {
      const manufacturing = new Manufacturing(trx, ctx.user.id)
      return await manufacturing.startProductionPhase(
        input.orderId,
        input.qty,
        input.force
      )
    })
  })

import { db, publicProcedure, z } from '#root/deps.js'
import { Manufacturing } from '#root/service/manufacturing.js'

export const finishManufacturing = publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input, ctx }) => {
    return await db.transaction().execute(async trx => {
      const manufacturing = new Manufacturing(trx, ctx.user.id)
      await manufacturing.finishOrder(input.id)
      return 'ok'
    })
  })

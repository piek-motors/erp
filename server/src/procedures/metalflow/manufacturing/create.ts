import { db, publicProcedure, z } from '#root/deps.js'
import { Manufacturing } from '#root/service/manufacturing.js'

export const createManufacturingOrder = publicProcedure
  .input(z.object({ detailId: z.number() }))
  .mutation(async ({ input, ctx }) => {
    return await db.transaction().execute(async trx => {
      const manufacturing = new Manufacturing(trx, ctx.user.id)
      const r = await manufacturing.createOrder(input.detailId)
      return {
        ...r,
        material_writeoffs: undefined
      }
    })
  })

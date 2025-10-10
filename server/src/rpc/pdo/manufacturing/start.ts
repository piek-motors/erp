import { db, publicProcedure, z } from '#root/deps.js'
import { Manufacturing } from '#root/service/manufacturing.service.js'

export const startManufacturing = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      qty: z.number().min(1)
    })
  )
  .mutation(async ({ input, ctx }) => {
    return await db.transaction().execute(async trx => {
      const manufacturing = new Manufacturing(trx, ctx.user.id)
      return await manufacturing.createOrder(input.detailId).then(res => ({
        writeoffs: res.material_writeoffs.writeoffs.map(m => ({
          material_id: m.material_id,
          writeoff_id: m.writeoff_id,
          total_cost: m.total_cost
        }))
      }))
    })
  })

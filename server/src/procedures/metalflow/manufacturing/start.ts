import { db, publicProcedure, z } from '#root/deps.js'
import { Manufacturing } from '#root/service/manufacturing.js'

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
      return await manufacturing
        .startProduction(input.detailId, input.qty)
        .then(res => ({
          writeoffs: res.map(m => ({
            material_id: m.material_id,
            material_name: m.material_name,
            writeoff_id: m.writeoff_id,
            stock: m.stock,
            total_cost: m.totalCost
          }))
        }))
    })
  })

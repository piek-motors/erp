import { db, z } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { Warehouse } from '#root/service/warehouse.js'
import { EnSupplyReason } from 'models'

export const createDetailSupply = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      qty: z.number(),
      reason: z.nativeEnum(EnSupplyReason)
    })
  )
  .mutation(async ({ input, ctx }) => {
    return await db.transaction().execute(async trx => {
      const warehouse = new Warehouse(trx, ctx.user.id)
      const result = await warehouse.addDetail(
        input.detailId,
        input.qty,
        input.reason
      )
      return {
        qty: result.stock.toString()
      }
    })
  })

import { db, z } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { Warehouse } from '#root/service/warehouse.service.js'
import { SupplyReason } from 'models'

export const createDetailSupply = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      qty: z.number().gt(0),
      reason: z.enum(SupplyReason)
    })
  )
  .mutation(async ({ input, ctx }) =>
    db.transaction().execute(async trx => {
      const warehouse = new Warehouse(trx, ctx.user.id)
      const result = await warehouse.addDetail(
        input.detailId,
        input.qty,
        input.reason
      )
      return {
        stock: result.stock
      }
    })
  )

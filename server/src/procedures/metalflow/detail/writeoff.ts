import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { Warehouse } from '#root/service/warehouse.js'
import { EnWriteoffReason } from 'models'
import { z } from 'zod'

export const createDetailWriteoff = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      qty: z.number().gt(0),
      reason: z.nativeEnum(EnWriteoffReason)
    })
  )
  .mutation(async ({ input, ctx }) =>
    db.transaction().execute(async trx => {
      const warehouse = new Warehouse(trx, ctx.user.id)
      const result = await warehouse.subtractDetail(
        input.detailId,
        input.qty,
        input.reason
      )
      return {
        stock: result.stock
      }
    })
  )

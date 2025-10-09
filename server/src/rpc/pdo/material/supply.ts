import { db, z } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { Warehouse } from '#root/service/warehouse.js'
import { EnSupplyReason } from 'models'

export const createMaterialSupply = publicProcedure
  .input(
    z.object({
      material_id: z.number(),
      lengthMeters: z.number().gt(0),
      reason: z.nativeEnum(EnSupplyReason)
    })
  )
  .mutation(async ({ input, ctx }) => {
    return await db.transaction().execute(async trx => {
      const warehouse = new Warehouse(trx, ctx.user.id)
      const result = await warehouse.addMaterial(
        input.material_id,
        input.lengthMeters,
        input.reason
      )
      return {
        qty: result.stock.toString()
      }
    })
  })

import { db, procedure, publicProcedure, z } from '#root/deps.js'
import { Warehouse } from '#root/service/warehouse.js'
import { EnWriteoffReason } from 'domain-model'

export const writeoffMaterial = procedure
  .input(
    z.object({
      material_id: z.number(),
      lengthMeters: z.number(),
      reason: z.nativeEnum(EnWriteoffReason),
      type_data: z.any()
    })
  )
  .mutation(async ({ input, ctx }) => {
    return await db.transaction().execute(async trx => {
      const warehouse = new Warehouse(trx, ctx.user.id)
      const result = await warehouse.subtractMaterial(
        input.material_id,
        input.lengthMeters,
        input.reason
      )
      return result.stock.toString()
    })
  })

export const deleteWriteoff = publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    return await db.transaction().execute(async trx => {
      await trx
        .deleteFrom('metal_flow.operations')
        .where('id', '=', input.id)
        .execute()
    })
  })

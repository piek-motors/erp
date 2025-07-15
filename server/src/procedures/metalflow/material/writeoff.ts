import { db, publicProcedure, z } from '#root/deps.js'
import { Warehouse } from '#root/service/warehouse.js'
import { EnOperationType, EnWriteoffReason } from 'domain-model'

export const listWriteoff = publicProcedure.query(async () => {
  const writeoffs = await db
    .selectFrom('metal_flow.operations as w')
    .where('w.operation_type', '=', EnOperationType.Writeoff)
    .innerJoin('metal_flow.materials as m', 'm.id', 'w.material_id')
    .select([
      'w.id',
      'w.qty',
      'w.timestamp',
      'w.reason',
      'w.data',
      'm.id as material_id',
      'm.label',
      'm.unit'
    ])
    .execute()

  return writeoffs
})

export const writeoffThroughMaterial = publicProcedure
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

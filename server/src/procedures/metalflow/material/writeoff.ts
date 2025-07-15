import { db, z } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
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
      const current_stock = await trx
        .selectFrom('metal_flow.materials')
        .select(['stock'])
        .where('id', '=', input.material_id)
        .executeTakeFirstOrThrow()

      if (current_stock.stock < input.lengthMeters) {
        throw new Error('Not enough stock')
      }

      await trx
        .insertInto('metal_flow.operations')
        .values({
          operation_type: EnOperationType.Writeoff,
          user_id: ctx.user.id,
          material_id: input.material_id,
          qty: input.lengthMeters,
          reason: input.reason
        })
        .execute()

      const res = await trx
        .updateTable('metal_flow.materials')
        .set(eb => ({
          stock: eb('stock', '-', input.lengthMeters)
        }))
        .returning(['id'])
        .where('id', '=', input.material_id)
        .returning(['stock'])
        .execute()

      return res[0].stock.toString()
    })
  })

export const writeoffThroughDetail = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      qty: z.number(),
      reason: z.nativeEnum(EnWriteoffReason)
    })
  )
  .mutation(async ({ input }) => {
    return await db.transaction().execute(async trx => {
      const detailMaterials = await trx
        .selectFrom('metal_flow.detail_materials')
        .leftJoin(
          'metal_flow.materials',
          'metal_flow.detail_materials.material_id',
          'metal_flow.materials.id'
        )
        .selectAll()
        .where('detail_id', '=', input.detailId)
        .execute()

      const ids: number[] = []
      for (const detailMaterial of detailMaterials) {
        const totalQty = detailMaterial.data.length * input.qty
        // insert writeoff
        const writeoff = await trx
          .insertInto('metal_flow.operations')
          .values({
            operation_type: EnOperationType.Writeoff,
            user_id: 0,
            material_id: detailMaterial.material_id,
            qty: totalQty,
            reason: input.reason
          })
          .returning(['id'])
          .execute()
        // update stock
        await trx
          .updateTable('metal_flow.materials')
          .set(eb => ({
            stock: eb('stock', '-', totalQty)
          }))
          .where('id', '=', detailMaterial.material_id)
          .execute()
        ids.push(detailMaterial.material_id)
      }

      return ids
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

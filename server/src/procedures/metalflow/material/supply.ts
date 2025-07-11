import { db, z } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { EnOperationType, EnSupplyReason } from 'domain-model'

export const listSupplies = publicProcedure.query(async () => {
  const supplies = await db
    .selectFrom('metal_flow.operations')
    .innerJoin('metal_flow.materials', 'metal_flow.materials.id', 'material_id')
    .selectAll()
    .execute()

  return supplies.map(e => {
    return {
      ...e,
      qty: e.qty?.toString()
    }
  })
})

export const createMaterialSupply = publicProcedure
  .input(
    z.object({
      material_id: z.number(),
      qty: z.number(),
      reason: z.nativeEnum(EnSupplyReason)
    })
  )
  .mutation(async ({ input }) => {
    const supply = await db
      .insertInto('metal_flow.operations')
      .values({
        operation_type: EnOperationType.Supply,
        timestamp: new Date(),
        material_id: input.material_id,
        detail_id: null,
        user_id: 0,
        qty: input.qty,
        reason: input.reason
      })
      .execute()

    const currentStock = await db
      .updateTable('metal_flow.materials')
      .set(eb => ({
        stock: eb('stock', '+', input.qty)
      }))
      .where('id', '=', input.material_id)
      .returning(['stock'])
      .execute()

    return {
      qty: currentStock[0].stock.toString()
    }
  })

export const deleteSupply = publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    await db
      .deleteFrom('metal_flow.operations')
      .where('id', '=', input.id)
      .execute()
  })

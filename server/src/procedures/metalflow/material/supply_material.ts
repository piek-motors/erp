import { db, z } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'

export const listSupplies = publicProcedure.query(async () => {
  const supplies = await db
    .selectFrom('metal_flow.supplies')
    .innerJoin('metal_flow.materials', 'metal_flow.materials.id', 'material_id')
    .selectAll()
    .execute()

  return supplies.map(e => {
    return {
      ...e,
      qty: e.qty.toString()
    }
  })
})

export const createMaterialSupply = publicProcedure
  .input(
    z.object({
      material_id: z.number(),
      qty: z.number()
    })
  )
  .mutation(async ({ input }) => {
    const supply = await db
      .insertInto('metal_flow.supplies')
      .values({
        material_id: input.material_id,
        qty: input.qty,
        supplied_at: new Date(),
        supplier_name: ''
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
      .deleteFrom('metal_flow.supplies')
      .where('id', '=', input.id)
      .execute()
  })

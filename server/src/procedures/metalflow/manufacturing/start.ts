import { db, publicProcedure, z } from '#root/deps.js'

export const addDetailIntoManufacturingList = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      qty: z.number()
    })
  )
  .mutation(async ({ input }) => {
    // select materials from which detail is made
    const materials = await db
      .selectFrom('metal_flow.detail_materials')
      .innerJoin('metal_flow.materials', 'material_id', 'id')
      .where('detail_id', '=', input.detailId)
      .select(['material_id', 'data', 'stock'])
      .execute()

    // write off materials
    for (const material of materials) {
      // check if current stock is enough
      if (material.stock < material.data.weight * input.qty) {
        throw new Error('Not enough materials')
      }
      const stockToSubtract = (material.data.weight * input.qty) / 1000
      await db
        .updateTable('metal_flow.materials')
        .set({
          // TODO: use atomic operations
          stock: material.stock - stockToSubtract
        })
        .where('id', '=', material.material_id)
        .execute()
    }

    await db
      .insertInto('metal_flow.manufacturing')
      .values({
        detail_id: input.detailId,
        qty: input.qty,
        finished_at: null
      })
      .execute()

    return 'ok'
  })

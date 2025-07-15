import { db, publicProcedure, z } from '#root/deps.js'

export const listOperations = publicProcedure
  .input(z.object({}))
  .query(async ({ ctx, input }) => {
    const operations = await db
      .selectFrom('metal_flow.operations as o')
      .leftJoin('metal_flow.materials as m', 'o.material_id', 'm.id')
      .leftJoin('metal_flow.details as d', 'o.detail_id', 'd.id')
      .selectAll(['o', 'm', 'd'])
      .select('d.name as detail_name')
      .select('o.id as operation_id')
      .select('m.label as material_label')
      .orderBy('o.id', 'desc')
      .limit(100)
      .execute()

    return operations
  })

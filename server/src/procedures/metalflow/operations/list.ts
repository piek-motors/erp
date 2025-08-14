import { db, publicProcedure, z } from '#root/deps.js'

export const listOperations = publicProcedure
  .input(
    z.object({
      materialId: z.number().optional(),
      detailId: z.number().optional()
    })
  )
  .query(async ({ ctx, input }) => {
    const operations = await db
      .selectFrom('metal_flow.operations as o')
      .$if(input.materialId != null, qb =>
        qb.where('o.material_id', '=', input.materialId!)
      )
      .$if(input.detailId != null, qb =>
        qb.where('o.detail_id', '=', input.detailId!)
      )
      .leftJoin('metal_flow.materials as m', 'o.material_id', 'm.id')
      .leftJoin('metal_flow.details as d', 'o.detail_id', 'd.id')
      .selectAll(['o'])
      .select('d.name as detail_name')
      .select('d.logical_group_id as logical_group_id')
      .select('m.label as material_label')
      .orderBy('o.id', 'desc')
      .limit(100)
      .execute()

    return operations
  })

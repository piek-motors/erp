import { db, publicProcedure, z } from '#root/deps.js'

export const getDetailsByMaterialId = publicProcedure
  .input(z.object({ material_id: z.number() }))
  .query(async ({ input }) =>
    db
      .selectFrom('metal_flow.detail_materials')
      .where('material_id', '=', input.material_id)
      .innerJoin('metal_flow.details', 'detail_id', 'id')
      .selectAll()
      .execute()
  )

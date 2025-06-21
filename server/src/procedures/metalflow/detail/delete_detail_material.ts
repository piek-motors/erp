import { db, z } from '../../../deps.ts'
import { publicProcedure } from '../../../lib/trpc/trpc.ts'

export const deleteDetailMaterial = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      materialId: z.number()
    })
  )
  .mutation(async ({ input }) => {
    return await db
      .deleteFrom('metal_flow.detail_materials')
      .where('detail_id', '=', input.detailId)
      .where('material_id', '=', input.materialId)
      .returningAll()
      .execute()
  })

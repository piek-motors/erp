import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'

export const listMaterials = publicProcedure.query(async ({ input }) => {
  return await db
    .selectFrom('metal_flow.materials as m')
    .select(['m.id', 'm.label', 'm.shape', 'm.shape_data', 'm.unit', 'm.stock'])
    .orderBy('m.label')
    .execute()
})

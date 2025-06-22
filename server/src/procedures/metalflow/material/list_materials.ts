import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'

export const listMaterials = publicProcedure.query(async ({ input }) => {
  const material = await db
    .selectFrom('metal_flow.materials')
    .selectAll()
    .execute()
  return material
})

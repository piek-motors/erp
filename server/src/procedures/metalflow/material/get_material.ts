import { db, z } from '../../../deps.ts'
import { publicProcedure } from '../../../lib/trpc/trpc.ts'

export const getMaterial = publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const material = await db
      .selectFrom('metal_flow.materials')
      .selectAll()
      .where('id', '=', input.id)
      .executeTakeFirstOrThrow()

    const details = await db
      .selectFrom('metal_flow.detail_materials')
      .where('material_id', '=', input.id)
      .innerJoin('metal_flow.details', 'detail_id', 'id')
      .selectAll()
      .execute()

    return { material, details }
  })

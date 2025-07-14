import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const getMaterial = publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const material = await db
      .selectFrom('metal_flow.materials')
      .selectAll()
      .where('id', '=', input.id)
      .executeTakeFirstOrThrow()

    const detailCount = await db
      .selectFrom('metal_flow.detail_materials')
      .where('material_id', '=', input.id)
      .select(eb => eb.fn.countAll().as('count'))
      .executeTakeFirstOrThrow()

    return { material, detailCount: Number(detailCount.count) }
  })

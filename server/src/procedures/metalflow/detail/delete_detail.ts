import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const deleteDetailProcedure = publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    await db
      .deleteFrom('metal_flow.details')
      .where('id', '=', input.id)
      .execute()
  })

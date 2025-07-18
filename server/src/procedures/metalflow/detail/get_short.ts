import { db, TRPCError } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const getDetailShortInfo = publicProcedure
  .input(
    z.object({
      id: z.number()
    })
  )
  .query(async ({ input }) => {
    return await db
      .selectFrom('metal_flow.details')
      .where('id', '=', input.id)
      .selectAll()
      .executeTakeFirstOrThrow()
      .catch(err => {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: err.message
        })
      })
  })

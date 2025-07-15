import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { EnWriteoffReason } from 'domain-model'
import { z } from 'zod'

export const createDetailWriteoff = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      qty: z.number(),
      reason: z.nativeEnum(EnWriteoffReason)
    })
  )
  .mutation(async ({ input }) => {
    return 'ok'
  })

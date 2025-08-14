import { db } from '#root/deps.js'
import { log } from '#root/ioc/log.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const deleteDetail = publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) =>
    db.transaction().execute(async trx => {
      await trx
        .deleteFrom('metal_flow.operations')
        .where('detail_id', '=', input.id)
        .execute()
      await trx
        .deleteFrom('metal_flow.detail_group_details')
        .where('detail_id', '=', input.id)
        .execute()
      await trx
        .deleteFrom('metal_flow.details')
        .where('id', '=', input.id)
        .execute()
      log.warn(`Detail deleted: ${input.id}`)
      return {
        success: true
      }
    })
  )

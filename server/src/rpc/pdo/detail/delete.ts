import { db } from '#root/deps.js'
import { log } from '#root/ioc/log.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const deleteDetail = publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) =>
    db.transaction().execute(async trx => {
      // CASCADE constraints will automatically delete related records from:
      // - pdo.manufacturing
      // - pdo.operations
      // - pdo.detail_group_details
      await trx.deleteFrom('pdo.details').where('id', '=', input.id).execute()
      log.warn(`Detail deleted: ${input.id}`)
      return {
        success: true
      }
    })
  )

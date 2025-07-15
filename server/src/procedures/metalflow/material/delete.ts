import { db } from '#root/deps.js'
import { log } from '#root/ioc/log.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const deleteMaterial = publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const { id } = input
    await db.transaction().execute(async trx => {
      await trx
        .deleteFrom('metal_flow.detail_materials')
        .where('material_id', '=', id)
        .execute()

      const { label } = await trx
        .deleteFrom('metal_flow.materials')
        .where('id', '=', id)
        .returning(['label'])
        .executeTakeFirstOrThrow()

      log.warn(`Material deleted: ${id} ${label}`)
    })
    return {
      success: true
    }
  })

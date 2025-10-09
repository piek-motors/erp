import { db, publicProcedure, z } from '#root/deps.js'
import { DB } from 'db'
import { Updateable } from 'kysely'
import { processingRouteSchema } from '../detail/shared.js'

export const updateManufacturing = publicProcedure
  .input(
    z.object({
      orderId: z.number(),
      processingRoute: processingRouteSchema.optional(),
      qty: z.number().nullable()
    })
  )
  .mutation(async ({ input, ctx }) => {
    const existing = await db
      .selectFrom('metal_flow.manufacturing')
      .where('id', '=', input.orderId)
      .select('data')
      .executeTakeFirstOrThrow()

    const update: Updateable<DB.ManufacturingTable> = {}
    if (input.qty) {
      update.qty = input.qty
    }
    if (input.processingRoute?.steps?.length) {
      update.data = {
        ...(existing.data ?? {}),
        processing_route: input.processingRoute
      }
    }

    return await db.transaction().execute(async trx => {
      await trx
        .updateTable('metal_flow.manufacturing')
        .set(update)
        .where('id', '=', input.orderId)
        .execute()
      return {
        success: true
      }
    })
  })

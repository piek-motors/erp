import { db, publicProcedure, z } from '#root/deps.js'
import { DB } from 'db'
import { Updateable } from 'kysely'

export const updateManufacturing = publicProcedure
  .input(
    z.object({
      orderId: z.number(),
      qty: z.number().nullable()
    })
  )
  .mutation(async ({ input, ctx }) => {
    const update: Updateable<DB.ManufacturingTable> = {}
    if (input.qty != null) {
      update.qty = input.qty
    }

    return await db.transaction().execute(async trx => {
      await trx
        .updateTable('pdo.manufacturing')
        .set(update)
        .where('id', '=', input.orderId)
        .execute()
      return {
        success: true
      }
    })
  })

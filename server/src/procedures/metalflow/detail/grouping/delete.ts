import { db, procedure, TRPCError } from '#root/deps.js'
import { z } from 'zod'

export const deleteDetailGroup = procedure
  .input(
    z.object({
      id: z.number()
    })
  )
  .mutation(async ({ input }) => {
    // First check if the group exists
    const group = await db
      .selectFrom('metal_flow.detail_group')
      .where('id', '=', input.id)
      .select(['id', 'name'])
      .executeTakeFirst()

    if (!group) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Detail group not found'
      })
    }

    // Delete in a transaction to ensure consistency
    await db.transaction().execute(async trx => {
      // First delete all detail associations
      await trx
        .deleteFrom('metal_flow.detail_group_details')
        .where('group_id', '=', input.id)
        .execute()

      // Then delete the group itself
      await trx
        .deleteFrom('metal_flow.detail_group')
        .where('id', '=', input.id)
        .execute()
    })

    return { success: true, deletedGroup: group }
  })

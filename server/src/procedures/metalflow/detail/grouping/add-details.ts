import { db, procedure, TRPCError } from '#root/deps.js'
import { z } from 'zod'

export const addDetailsToGroup = procedure
  .input(
    z.object({
      groupId: z.number(),
      detailIds: z
        .array(z.number())
        .min(1, 'At least one detail must be provided')
    })
  )
  .mutation(async ({ input }) => {
    // First check if the group exists
    const group = await db
      .selectFrom('metal_flow.detail_group')
      .where('id', '=', input.groupId)
      .selectAll()
      .executeTakeFirst()

    if (!group) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Detail group not found'
      })
    }

    // Check if all details exist
    const details = await db
      .selectFrom('metal_flow.details')
      .where('id', 'in', input.detailIds)
      .select(['id'])
      .execute()

    if (details.length !== input.detailIds.length) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'One or more details not found'
      })
    }

    try {
      // Insert the associations, ignoring duplicates
      const insertPromises = input.detailIds.map(detailId =>
        db
          .insertInto('metal_flow.detail_group_details')
          .values({
            group_id: input.groupId,
            detail_id: detailId
          })
          .onConflict(oc => oc.columns(['group_id', 'detail_id']).doNothing())
          .execute()
      )

      await Promise.all(insertPromises)

      return {
        success: true,
        group,
        addedDetails: details
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add details to group'
      })
    }
  })

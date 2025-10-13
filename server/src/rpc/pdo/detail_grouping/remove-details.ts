import { db, procedure, TRPCError } from '#root/deps.js'
import { z } from 'zod'

export const removeDetailsFromGroup = procedure
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
      .select(['id', 'name'])
      .executeTakeFirst()

    if (!group) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Detail group not found'
      })
    }

    try {
      // Delete the associations
      const result = await db
        .deleteFrom('metal_flow.detail_group_details')
        .where('group_id', '=', input.groupId)
        .where('detail_id', 'in', input.detailIds)
        .returning(['detail_id'])
        .execute()

      return {
        success: true,
        group,
        removedDetailIds: result.map(r => r.detail_id)
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to remove details from group'
      })
    }
  })

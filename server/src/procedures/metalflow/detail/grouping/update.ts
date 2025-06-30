import { db, procedure, TRPCError } from '#root/deps.js'
import { z } from 'zod'

export const updateDetailGroup = procedure
  .input(
    z.object({
      id: z.number(),
      name: z.string().min(1, 'Group name is required')
    })
  )
  .mutation(async ({ input }) => {
    try {
      const result = await db
        .updateTable('metal_flow.detail_group')
        .set({
          name: input.name
        })
        .where('id', '=', input.id)
        .returning(['id', 'name'])
        .executeTakeFirst()

      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Detail group not found'
        })
      }

      return result
    } catch (error: any) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A detail group with this name already exists'
        })
      }
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update detail group'
      })
    }
  })

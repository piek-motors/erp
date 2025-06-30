import { db, procedure, TRPCError } from '#root/deps.js'
import { z } from 'zod'

export const createDetailGroup = procedure
  .input(
    z.object({
      name: z.string().min(5, 'Group name is required')
    })
  )
  .mutation(async ({ input }) => {
    try {
      const result = await db
        .insertInto('metal_flow.detail_group')
        .values({
          name: input.name
        })
        .returning(['id', 'name'])
        .executeTakeFirstOrThrow()

      return result
    } catch (error: any) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A detail group with this name already exists'
        })
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create detail group'
      })
    }
  })

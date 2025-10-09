import { db, procedure, TRPCError, z } from '#root/deps.js'

export const updateName = procedure
  .input(
    z.object({
      key: z.string(),
      name: z.string()
    })
  )
  .mutation(async ({ input }) => {
    const attachment = await db
      .updateTable('attachments')
      .set({ filename: input.name })
      .where('key', '=', input.key)
      .executeTakeFirst()

    if (!attachment) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Attachment not found'
      })
    }

    return 'ok'
  })

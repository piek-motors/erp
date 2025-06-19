import { config, db, procedure, s3, TRPCError, z } from '../../deps.ts'

export const deleteFile = procedure
  .input(
    z.object({
      key: z.string(),
      type: z.enum(['order', 'detail'])
    })
  )
  .mutation(async ({ input }) => {
    const attachmentId = await db
      .deleteFrom('attachments')
      .where('key', '=', input.key)
      .returning('id')
      .executeTakeFirst()

    if (!attachmentId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Attachment not found'
      })
    }

    await s3
      .deleteObject({ Bucket: config.S3_BUCKET, Key: input.key })
      .promise()
      .catch(err => {
        throw new Error(`Could not delete file from S3: ${err.message}`)
      })

    switch (input.type) {
      case 'order':
        await db
          .deleteFrom('orders.order_attachments')
          .where('attachment_id', '=', attachmentId.id)
          .execute()
        break
      case 'detail':
        await db
          .deleteFrom('metal_flow.detail_attachments')
          .where('attachment_id', '=', attachmentId.id)
          .execute()
        break
      default:
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid type'
        })
    }

    return 'ok'
  })

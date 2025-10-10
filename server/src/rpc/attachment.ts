import { config, db, procedure, s3, TRPCError } from '#root/deps.js'
import { attachmentService } from '#root/ioc/index.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const getDetailAttachments = publicProcedure
  .input(
    z.object({
      detailId: z.number()
    })
  )
  .query(async ({ input }) => {
    return await attachmentService.getDetailAttachments(input.detailId)
  })

export const getAttachmentByKey = publicProcedure
  .input(
    z.object({
      key: z.string()
    })
  )
  .query(async ({ input }) => {
    return await attachmentService.getAttachmentByKey(input.key)
  })

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

export const deleteFile = publicProcedure
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

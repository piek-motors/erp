import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { AttachmentService } from '#root/service/attachment.js'
import { z } from 'zod'

const attachmentService = new AttachmentService()

export const getOrderAttachments = publicProcedure
  .input(
    z.object({
      orderId: z.number()
    })
  )
  .query(async ({ input }) => {
    return await attachmentService.getOrderAttachments(input.orderId)
  })

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

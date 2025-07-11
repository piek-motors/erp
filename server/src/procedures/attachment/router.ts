import { router } from '#root/lib/trpc/trpc.js'
import { deleteFile } from './delete-file.rpc.js'
import {
  getAttachmentByKey,
  getDetailAttachments,
  getOrderAttachments
} from './get.js'

export const attachmentRouter = router({
  deleteFile,
  getOrderAttachments,
  getDetailAttachments,
  getAttachmentByKey
})

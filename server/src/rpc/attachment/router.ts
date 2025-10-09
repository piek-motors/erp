import { router } from '#root/lib/trpc/trpc.js'
import { deleteFile } from './delete_file.rpc.js'
import {
  getAttachmentByKey,
  getDetailAttachments,
  getOrderAttachments
} from './get.js'
import { updateName } from './update_name.js'

export const attachmentRouter = router({
  updateName,
  deleteFile,
  getOrderAttachments,
  getDetailAttachments,
  getAttachmentByKey
})

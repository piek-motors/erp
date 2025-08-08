import { AttachmentList } from 'components'
import { observer } from 'mobx-react-lite'
import { Attachment } from 'models'
import { useEffect } from 'react'
import { ordersApi } from '../orders.api'
import { orderStore } from './stores/order.store'

interface OrderAttachmentListProps {
  orderId: number
  onDelete?: (attachment: any) => void
}

export const OrderAttachmentList = observer(
  ({ orderId, onDelete }: OrderAttachmentListProps) => {
    useEffect(() => {
      if (orderId) {
        ordersApi.loadAttachments(orderId).then(attachments => {
          orderStore.attachments.setFiles(attachments)
        })
      }
    }, [orderId])

    const handleDelete =
      onDelete ||
      ((attachment: any) => {
        orderStore.attachments.delete(attachment, 'order')
      })

    const handleUpload = (files: FileList) => {
      orderStore.attachments.onDrop(Array.from(files), orderId, 'order')
    }

    const handleRename = (attachment: Attachment, name: string) => {
      orderStore.attachments.rename(attachment, name)
    }

    return (
      <AttachmentList
        attachments={orderStore.attachments.files}
        uploadingFiles={orderStore.attachments.uploadingFiles}
        onRename={handleRename}
        onDelete={handleDelete}
        onUpload={handleUpload}
        title="Документы"
      />
    )
  }
)

import { AttachmentList } from 'components'
import { observer } from 'mobx-react-lite'
import { orderStore } from 'pages/orders/one/stores/order.store'
import { ordersApi } from 'pages/orders/orders.api'
import { useEffect } from 'react'

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

    return (
      <AttachmentList
        attachments={orderStore.attachments.files}
        uploadingFiles={orderStore.attachments.uploadingFiles}
        onDelete={handleDelete}
        onUpload={handleUpload}
        title="Документы"
        emptyMessage="Нет документов"
      />
    )
  }
)

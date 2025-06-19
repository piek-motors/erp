import { AttachmentList } from 'components'
import { observer, useEffect } from 'lib'
import { detailStore } from '../store'
import { getDetailAttachments } from './store/detail.api'

interface DetailAttachmentListProps {
  detailId: number
  onDelete?: (attachment: any) => void
}

export const DetailAttachmentList = observer(
  ({ detailId, onDelete }: DetailAttachmentListProps) => {
    useEffect(() => {
      if (detailId) {
        getDetailAttachments(detailId).then(attachments => {
          detailStore.attachments.setFiles(attachments)
        })
      }
    }, [detailId])

    const handleDelete =
      onDelete ||
      ((attachment: any) => {
        detailStore.attachments.delete(attachment, 'detail')
      })

    const handleUpload = (files: FileList) => {
      detailStore.attachments.onDrop(Array.from(files), detailId, 'detail')
    }

    return (
      <AttachmentList
        attachments={detailStore.attachments.files}
        uploadingFiles={detailStore.attachments.uploadingFiles}
        onDelete={handleDelete}
        onUpload={handleUpload}
        title="Файлы детали"
        emptyMessage="Ничего не прикреплено (∪｡∪)｡｡｡zzz"
      />
    )
  }
)

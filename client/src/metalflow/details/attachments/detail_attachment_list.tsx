import { AttachmentList } from 'components'
import { observer } from 'lib'
import { detailStore } from '../detail.store'

interface DetailAttachmentListProps {
  detailId: number
  onDelete?: (attachment: any) => void
}

export const DetailAttachmentList = observer(
  ({ detailId, onDelete }: DetailAttachmentListProps) => {
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
      />
    )
  }
)

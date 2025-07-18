import { AttachmentList } from 'components'
import { Attachment } from 'domain-model'
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

    const handleRename = (attachment: Attachment, name: string) => {
      detailStore.attachments.rename(attachment, name)
    }

    return (
      <AttachmentList
        attachments={detailStore.attachments.files}
        uploadingFiles={detailStore.attachments.uploadingFiles}
        onDelete={handleDelete}
        onRename={handleRename}
        onUpload={handleUpload}
        title="Файлы детали"
      />
    )
  }
)

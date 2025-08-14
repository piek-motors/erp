import { AttachmentList } from 'components'
import { observer } from 'lib'
import { Attachment } from 'models'
import { api } from '../api'

interface DetailAttachmentListProps {
  detailId: number
  onDelete?: (attachment: any) => void
}

export const DetailAttachmentList = observer(
  ({ detailId, onDelete }: DetailAttachmentListProps) => (
    <AttachmentList
      attachments={api.detail.attachments.files}
      uploadingFiles={api.detail.attachments.uploadingFiles}
      onDelete={
        onDelete ||
        ((attachment: any) => {
          api.detail.attachments.delete(attachment, 'detail')
        })
      }
      onRename={(attachment: Attachment, name: string) => {
        api.detail.attachments.rename(attachment, name)
      }}
      onUpload={(files: FileList) => {
        api.detail.attachments.onDrop(Array.from(files), detailId, 'detail')
      }}
      title="Файлы"
    />
  )
)

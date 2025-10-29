import { AttachmentList } from 'components/attachments/attachment-list'
import { observer } from 'lib'
import { Attachment } from 'models'
import { DetailState } from '../detail.state'

interface DetailAttachmentListProps {
  detail: DetailState
  onDelete?: (attachment: Attachment) => void
}

export const DetailAttachmentList = observer(
  ({ detail, onDelete }: DetailAttachmentListProps) => (
    <AttachmentList
      attachments={detail.attachments.files}
      uploadingFiles={detail.attachments.uploadingFiles}
      onDelete={
        onDelete ||
        ((attachment: Attachment) => {
          detail.attachments.delete(attachment, 'detail')
        })
      }
      onRename={(attachment: Attachment, name: string) => {
        detail.attachments.rename(attachment, name)
      }}
      onUpload={(files: FileList) => {
        detail.attachments.onDrop(Array.from(files), detail.id, 'detail')
      }}
      title=""
    />
  )
)

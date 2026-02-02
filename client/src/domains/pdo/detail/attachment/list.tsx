import { AttachmentList } from 'components/attachments/attachment-list'
import { Attachment } from 'components/attachments/store'
import { observer } from 'lib'
import type { DetailSt } from '../detail.state'

interface Props {
	detail: DetailSt
	onDelete?: (attachment: Attachment) => void
}

export const DetailAttachmentList = observer(({ detail, onDelete }: Props) => (
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
))

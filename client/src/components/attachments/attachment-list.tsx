import { Box, Stack } from '@mui/joy'
import { WebOnly } from 'components/utilities/conditional-display'
import { Label, Loading } from 'lib/index'
import { InputFiles } from '../input-files'
import { AttachmentComponent } from './attachment'
import { Attachment } from './store'

interface AttachmentListProps {
	attachments: Attachment[]
	uploadingFiles?: File[]
	onDelete?: (attachment: Attachment) => void
	onUpload?: (files: FileList) => void
	onRename?: (attachment: Attachment, name: string) => void
	title?: string
	uploadInputProps?: {
		size?: 'sm' | 'md' | 'lg'
		variant?: 'outlined' | 'solid' | 'soft' | 'plain'
		sx?: any
	}
}

export const AttachmentList = ({
	attachments,
	uploadingFiles = [],
	onDelete,
	onUpload,
	onRename,
	title = 'Документы',
	uploadInputProps = {},
}: AttachmentListProps) => {
	return (
		<Stack gap={1}>
			<Label>{title}</Label>
			<Stack gap={1}>
				{attachments.map(attachment => (
					<AttachmentComponent
						key={attachment.key}
						attachment={attachment}
						handleDelete={onDelete}
						handleRename={onRename}
					/>
				))}

				{Boolean(uploadingFiles.length) &&
					uploadingFiles.map(file => (
						<Box key={file.name}>
							<AttachmentComponent
								attachment={
									new Attachment(
										crypto.getRandomValues(new Uint32Array(1))[0],
										file.name,
										file.size,
										file.name,
									)
								}
							/>
							<Loading />
						</Box>
					))}
			</Stack>
			{onUpload && (
				<WebOnly>
					<InputFiles
						size={uploadInputProps.size || 'sm'}
						variant={uploadInputProps.variant || 'outlined'}
						sx={{ fontSize: '.8rem', ...uploadInputProps.sx }}
						upload={onUpload}
					/>
				</WebOnly>
			)}
		</Stack>
	)
}

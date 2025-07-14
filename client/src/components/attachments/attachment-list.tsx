import { Box, Stack } from '@mui/joy'
import { Attachment } from 'domain-model'
import { P, Row, text } from 'lib/index'
import { InputFiles } from '../input-files'
import { AttachmentComponent } from './attachment'

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
  uploadInputProps = {}
}: AttachmentListProps) => {
  return (
    <Stack gap={1}>
      <Row gap={2}>
        <P>
          {title} <P level="body-xs">[{attachments.length}]</P>
        </P>
      </Row>
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
              <P level="body-sm">{text.loading}</P>
              <AttachmentComponent
                attachment={
                  new Attachment(
                    crypto.getRandomValues(new Uint32Array(1))[0],
                    file.name,
                    file.size,
                    file.name
                  )
                }
              />
            </Box>
          ))}
      </Stack>
      {onUpload && (
        <InputFiles
          size={uploadInputProps.size || 'sm'}
          variant={uploadInputProps.variant || 'outlined'}
          sx={{ fontSize: '.8rem', ...uploadInputProps.sx }}
          upload={onUpload}
        />
      )}
    </Stack>
  )
}

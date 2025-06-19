import { Box, Stack } from '@mui/joy'
import { Attachment } from 'domain-model'
import { P, Row, text } from 'lib/shortcuts'
import { InputFiles } from '../input-files'
import { AttachmentComponent } from './attachment'

interface AttachmentListProps {
  attachments: Attachment[]
  uploadingFiles?: File[]
  onDelete?: (attachment: Attachment) => void
  onUpload?: (files: FileList) => void
  title?: string
  emptyMessage?: string
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
  title = 'Документы',
  emptyMessage = 'Нет документов',
  uploadInputProps = {}
}: AttachmentListProps) => {
  if (!attachments?.length && !uploadingFiles?.length && !onUpload) {
    return (
      <P p={1} color="neutral">
        {emptyMessage}
      </P>
    )
  }

  return (
    <>
      <Row gap={2}>
        <P>
          {title} [{attachments.length}]
        </P>
      </Row>
      <Stack gap={1} py={2}>
        {attachments.map(attachment => (
          <AttachmentComponent
            key={attachment.key}
            attachment={attachment}
            handleDelete={onDelete}
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
                uploadingInProgress={true}
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
    </>
  )
}

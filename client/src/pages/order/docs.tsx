/** @jsxImportSource @emotion/react */
import { UilFile, UilFileAlt, UilImage } from '@iconscout/react-unicons'
import { Box, Stack, Typography } from '@mui/joy'
import moment from 'moment'
import { useOrderDetailStore } from 'pages/order/state'
import { useEffect } from 'react'
import { FileService } from 'services/file.service'
import { DeleteResourceButton, Row } from 'shortcuts'
import { useNotifier } from 'store/notifier.store'
import { TOrderDocument } from 'types/global'

function File(props: {
  file: TOrderDocument
  handleOnDelete: (file: TOrderDocument) => void
  uploading?: boolean
  editState: boolean
  refetch: () => void
}) {
  const notifier = useNotifier()
  const { file, uploading, editState } = props
  const handleDeleteFile = async () => {
    await FileService.deleteFile(props.file.Key!)
    notifier.notify('info', `Файл ${props.file.FileName} удален`)
    props.refetch()
  }

  return (
    <Row>
      <Box gap={1}>
        <a
          href={`${process.env.REACT_APP_API_URL}/s3/${file.Key}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            fontWeight: 'normal'
          }}
        >
          <Row>
            {getformatAssociatedIcon(file.FileName ?? '')}
            <Typography>{file.FileName}</Typography>
          </Row>

          {!uploading ? (
            <Row>
              <Typography level="body-sm" fontWeight={400}>
                {formatBytes(file.Size!)}
                {', '}
                {moment(file.UploadingDate).format('D MMMM')}
              </Typography>
            </Row>
          ) : (
            <Typography level="body-sm">Файл выгружается...</Typography>
          )}
        </a>
      </Box>

      {editState && <DeleteResourceButton onClick={handleDeleteFile} />}
    </Row>
  )
}

export function Docs(props: {
  data: TOrderDocument[]
  refetch(): void
  onUpload: File[]
}) {
  const { refetch, data, onUpload } = props
  const { editMode } = useOrderDetailStore()
  const handleClickOpenDialog = async (file: TOrderDocument) => {
    await FileService.deleteFile(file.Key!)
    refetch()
  }
  useEffect(() => {
    onUpload.map((file: File) => ({ ...file, FileName: file.name }))
  }, [onUpload])

  if (!data.length) {
    return (
      <Typography p={1} color="neutral">
        Нет документов
      </Typography>
    )
  }

  return (
    <div>
      <Row gap={2}>
        <Typography>Документы [{data.length}]</Typography>
      </Row>
      <Stack gap={1} py={2}>
        {data.map(file => (
          <File
            refetch={refetch}
            key={file.Key}
            file={file}
            editState={editMode}
            handleOnDelete={handleClickOpenDialog}
          />
        ))}

        {!!onUpload.length &&
          onUpload.map(file => (
            <File
              refetch={refetch}
              file={{
                ...file,
                FileName: file.name,
                Key: file.name,
                ID: crypto.getRandomValues(new Uint32Array(1))[0]
              }}
              key={file.name}
              editState={editMode}
              handleOnDelete={handleClickOpenDialog}
              uploading
            />
          ))}
      </Stack>
    </div>
  )
}

// converts file size from bytes to human-readable string
export function formatBytes(bytes: number): string {
  if (!bytes) return '0 Bytes'
  var k = 1024,
    dm = 1,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function getformatAssociatedIcon(filename: string) {
  const size = 24
  const fileExtension = filename.split('.')[filename.split('.').length - 1]

  if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
    return <UilImage width={size} />
  } else if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
    return <UilFileAlt width={size} />
  } else {
    return <UilFile width={size} />
  }
}

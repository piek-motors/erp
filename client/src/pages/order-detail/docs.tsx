/** @jsxImportSource @emotion/react */
import { UilFile, UilFileAlt, UilImage } from '@iconscout/react-unicons'
import { Box, Stack, Typography } from '@mui/joy'
import moment from 'moment'
import { useEffect } from 'react'
import { useOrderDetailStore } from 'src/pages/order-detail/state'
import { TOrderDocument } from 'src/types/global'
import { FileService } from '../../services/file.service'
import { DeleteResourceButton, Row } from '../../shortcuts'
import { useNotifier } from '../../store/notifier.store'

function DocUnit(props: {
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
            <Typography level="body-sm" fontWeight={400}>
              <Row>
                {formatBytes(file.Size!)}
                {', '}
                {moment(file.UploadingDate).format('D MMMM')}
              </Row>
            </Typography>
          ) : (
            <Typography level="body-sm">Файл выгружается...</Typography>
          )}
        </a>
      </Box>

      {editState && <DeleteResourceButton onClick={handleDeleteFile} />}
    </Row>
  )
}

export function DocList(props: {
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

  if (!data.length)
    return (
      <Typography p={1} color="neutral">
        Нет документов
      </Typography>
    )
  return (
    <div>
      <Row gap={2}>
        <Typography>Документы [{data.length}]</Typography>
      </Row>
      <Stack gap={1} py={2}>
        {data.map(file => (
          <DocUnit
            refetch={refetch}
            key={file.Key}
            file={file}
            editState={editMode}
            handleOnDelete={handleClickOpenDialog}
          />
        ))}

        {!!onUpload.length &&
          onUpload.map(file => (
            <DocUnit
              refetch={refetch}
              file={{ ...file, FileName: file.name, Key: file.name, ID: 22 }}
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
  const fileExtension = filename.split('.')[filename.split('.').length - 1]

  if (['png', 'jpg', 'jpeg'].includes(fileExtension)) return <UilImage />
  if (['pdf', 'doc', 'docx'].includes(fileExtension)) return <UilFileAlt />
  else return <UilFile />
}

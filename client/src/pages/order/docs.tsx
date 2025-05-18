/** @jsxImportSource @emotion/react */
import { UilFile, UilFileAlt, UilImage } from '@iconscout/react-unicons'
import { Box, Button, Stack, Typography } from '@mui/joy'
import { Observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { FileService } from 'services/file.service'
import { DeleteResourceButton, Row } from 'shortcuts'
import { useNotifier } from 'store/notifier.store'
import { TOrderDocument } from 'types/global'
import { orderStore } from './order.store'

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
    <Row justifyContent={'space-between'}>
      <Box>
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
          <Button
            variant="plain"
            sx={{ fontSize: '1rem', textAlign: 'left', fontWeight: 'normal' }}
            color="primary"
            size="sm"
            startDecorator={getformatAssociatedIcon(file.FileName ?? '')}
          >
            <Typography level="body-sm">{file.FileName}</Typography>
          </Button>
          {uploading && (
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
    <Observer
      render={() => {
        return (
          <>
            <Row gap={2}>
              <Typography>Документы [{data.length}]</Typography>
            </Row>
            <Stack gap={1} py={2}>
              {data.map(file => (
                <File
                  refetch={refetch}
                  key={file.Key}
                  file={file}
                  editState={orderStore.editMode}
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
                    editState={orderStore.editMode}
                    handleOnDelete={handleClickOpenDialog}
                    uploading
                  />
                ))}
            </Stack>
          </>
        )
      }}
    />
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

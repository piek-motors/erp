/** @jsxImportSource @emotion/react */
import { UilFile, UilFileAlt, UilImage } from '@iconscout/react-unicons'
import { Box, Button, Stack, Typography } from '@mui/joy'
import { OrderAttachment } from 'domain-model'
import { observer } from 'mobx-react-lite'
import { docsStore } from 'pages/orders/one/docs.store'
import { useEffect } from 'react'
import { DeleteResourceButton, Row, text, UseIcon } from 'shortcuts'
import { orderStore } from './order.store'

const File = observer((props: { file: OrderAttachment }) => {
  const { file } = props

  return (
    <Row justifyContent={'space-between'}>
      <Box>
        <a
          href={`${process.env.REACT_APP_API_URL}/s3/${file.key}`}
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
            startDecorator={getformatAssociatedIcon(file.name)}
          >
            <Typography level="body-sm">{file.name}</Typography>
          </Button>
          {docsStore.uploading && (
            <Typography level="body-sm">Файл выгружается...</Typography>
          )}
        </a>
      </Box>

      {orderStore.editMode && (
        <DeleteResourceButton onClick={() => docsStore.deleteFile(file)} />
      )}
    </Row>
  )
})

export const Docs = observer((props: { orderId: number }) => {
  const { orderId } = props
  useEffect(() => {
    orderId && docsStore.fetchAttachments(orderId)
  }, [])

  const data = docsStore.files
  if (!data?.length) {
    return (
      <Typography p={1} color="neutral">
        Нет документов
      </Typography>
    )
  }
  return (
    <>
      <Row gap={2}>
        <Typography>Документы [{data.length}]</Typography>
      </Row>
      <Stack gap={1} py={2}>
        {data.map(file => (
          <File key={file.key} file={file} />
        ))}

        {Boolean(docsStore.uploadingFiles.length) &&
          docsStore.uploadingFiles.map(file => (
            <Box>
              <Typography level="body-sm">{text.loading}</Typography>
              <File
                file={
                  new OrderAttachment({
                    ...file,
                    key: file.name,
                    name: file.name,
                    id: crypto.getRandomValues(new Uint32Array(1))[0]
                  })
                }
                key={file.name}
              />
            </Box>
          ))}
      </Stack>
    </>
  )
})

export function getformatAssociatedIcon(filename: string) {
  const fileExtension = filename.split('.')[filename.split('.').length - 1]
  if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
    return <UseIcon icon={UilImage} />
  } else if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
    return <UseIcon icon={UilFileAlt} />
  } else {
    return <UseIcon icon={UilFile} />
  }
}

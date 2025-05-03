/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilTimes } from '@iconscout/react-unicons'
import { Box, Button, IconButton, Modal, Sheet, Typography } from '@mui/joy'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useOrderDetailStore } from 'src/pages/order-detail/state'
import { TOrderDocument } from 'src/types/global'
import { FileService } from '../../services/file.service'

interface IConfirmDialogProps {
  filename: string
  open: boolean
  handleClose(): void
  onConfirm(): void
}

function ConfirmDialog({
  filename,
  open,
  handleClose,
  onConfirm
}: IConfirmDialogProps) {
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Sheet>
          <Typography>
            Удалить <span>{filename}</span> ?
          </Typography>
          <Box>
            <Button onClick={handleClose}>Отменить</Button>
            <Button
              color="danger"
              onClick={() => {
                handleClose()
                onConfirm()
              }}
            >
              Удалить
            </Button>
          </Box>
        </Sheet>
      </Modal>
    </div>
  )
}

interface IDocUnitProps {
  file: TOrderDocument
  handleOnDelete: (file: TOrderDocument) => void
  uploading?: boolean
  editState: boolean
}

function DocUnit({
  file,
  handleOnDelete,
  uploading,
  editState
}: IDocUnitProps) {
  const styles = css`
    padding: 8px 10px;
    display: flex;
    a {
      flex-grow: 1;
      display: grid !important;
      grid-template-columns: auto 1fr;
      grid-template-areas: 'svg name' 'svg date';

      &:hover {
        svg,
        .name {
          color: var(--accent);
        }
      }

      svg {
        grid-area: svg;
        color: var(--lowContrast);
        padding-right: 8px;
        stroke-width: 0.8;
        stroke: var(--L0);
      }

      .name {
        grid-area: name;
      }

      .date {
        grid-area: date;
        color: var(--lowContrast);
        font-size: 0.9rem;
      }
      button {
        padding: 0px 4px;
      }
    }
  `

  return (
    <div css={styles}>
      <a
        href={`${process.env.REACT_APP_API_URL}/s3/${file.Key}`}
        target="_blank"
        rel="noreferrer"
      >
        {formatAssociatedIcon(file.FileName ?? '')}
        <div className="name">{file.FileName}</div>

        <div className="date" data-testid="filemeta">
          {formatBytes(file.Size!)} |{' '}
          {moment(file.UploadingDate).format('D MMMM')}
        </div>
      </a>

      {editState && (
        <IconButton
          variant="plain"
          color="danger"
          onClick={() => handleOnDelete(file)}
        >
          <UilTimes />
        </IconButton>
      )}
    </div>
  )
}

interface IDocsProps {
  data: TOrderDocument[]
  refetch(): void
  onUpload: File[]
}

export default function Docs({ refetch, data, onUpload }: IDocsProps) {
  const { editMode } = useOrderDetailStore()
  const [open, setOpen] = useState(false)
  const [fileOnDelete, setFileOnDelete] = useState<TOrderDocument>()

  const handleClickOpenDialog = (file: TOrderDocument) => {
    setFileOnDelete(file)
    setOpen(true)
  }

  const handleCloseDialog = () => setOpen(false)

  useEffect(() => {
    setOpen(false)
  }, [editMode])

  const handleDeleteFile = async () => {
    //close modal window
    handleCloseDialog()

    // also removed file metadata from database
    await FileService.deleteFile(fileOnDelete?.Key!)
    refetch()
  }

  useEffect(() => {
    onUpload.map((file: File) => ({ ...file, FileName: file.name }))
  }, [onUpload])

  const titleStyles = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px;
  `

  return (
    <div className="Docs">
      <div css={titleStyles}>
        <Typography>Документы [{data.length}]</Typography>
      </div>

      <div>
        {data.map(file => (
          <DocUnit
            key={file.Key}
            file={file}
            editState={editMode}
            handleOnDelete={handleClickOpenDialog}
          />
        ))}

        {!!onUpload.length &&
          onUpload.map(file => (
            <DocUnit
              file={{ ...file, FileName: file.name, Key: file.name, ID: 22 }}
              key={file.name}
              editState={editMode}
              handleOnDelete={handleClickOpenDialog}
              uploading
            />
          ))}
      </div>

      <ConfirmDialog
        filename={fileOnDelete?.FileName ?? ''}
        open={open}
        handleClose={handleCloseDialog}
        onConfirm={handleDeleteFile}
      />
    </div>
  )
}

import { UilFile, UilFileAlt, UilImage } from '@iconscout/react-unicons'

// converts file size from bytes to human-readable string
export function formatBytes(bytes: number): string {
  if (!bytes) return '0 Bytes'
  var k = 1024,
    dm = 1,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatAssociatedIcon(filename: string) {
  const fileExtension = filename.split('.')[filename.split('.').length - 1]

  if (['png', 'jpg', 'jpeg'].includes(fileExtension)) return <UilImage />
  if (['pdf', 'doc', 'docx'].includes(fileExtension)) return <UilFileAlt />
  else return <UilFile />
}

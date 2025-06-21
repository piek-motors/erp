import { Button, Modal, ModalDialog, Sheet } from '@mui/joy'
import { P, Row } from 'lib/index'
import { ReactNode, useState } from 'react'
interface ConfirmDialogProps {
  title: ReactNode
  handleDelete(): Promise<unknown>
  button: ReactNode
}

export function DeleteConfirmDialog(props: ConfirmDialogProps) {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <div onClick={handleClickOpen}> {props.button} </div>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog>
          <Sheet>
            <P>
              Вы уверены, что хотите удалить?
              <br />
              <br />
              <P fontWeight={600} level="h4">
                {props.title}
              </P>
              <br />
              <br />
              Это необратимо.
            </P>
            <Row mt={2} gap={2}>
              <Button
                onClick={() => handleClose()}
                variant="soft"
                color="neutral"
              >
                Отмена
              </Button>
              <Button
                color="danger"
                onClick={async () => {
                  handleClose()
                  await props.handleDelete()
                }}
              >
                Удалить
              </Button>
            </Row>
          </Sheet>
        </ModalDialog>
      </Modal>
    </>
  )
}

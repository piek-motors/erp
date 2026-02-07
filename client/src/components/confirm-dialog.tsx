import { P } from '@/lib/index'
import { Box, Button, Modal, ModalDialog, Sheet } from '@mui/joy'
import { type ReactNode, useState } from 'react'

// extrnalСomponent is the whichever component which will be go out
// like as icon or textButton or something else
interface ConfirmDialogProps {
  title: string
  body: string
  confirmButtonLabel: string
  confirmButtonHandler(): void
  isDangerous?: boolean
  children?: ReactNode
}

export function ConfirmDialog({
  confirmButtonLabel: confirmLabel,
  confirmButtonHandler: onCloseComplete,
  isDangerous,
  title,
  body,
  children,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <div onClick={handleClickOpen}> {children} </div>
      <Modal id={title} open={open} onClose={handleClose}>
        <ModalDialog>
          <Sheet>
            {title && (
              <P level="h4" pb={2}>
                {title}
              </P>
            )}
            {body && <P>{body}</P>}
            <Box mt={2}>
              <Button
                onClick={() => handleClose()}
                variant="plain"
                color="neutral"
              >
                Закрыть
              </Button>
              <Button
                color={isDangerous ? 'danger' : 'primary'}
                onClick={() => {
                  handleClose()
                  onCloseComplete()
                }}
              >
                {confirmLabel}
              </Button>
            </Box>
          </Sheet>
        </ModalDialog>
      </Modal>
    </>
  )
}

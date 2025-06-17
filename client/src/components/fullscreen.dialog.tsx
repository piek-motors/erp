import { Box, Modal, ModalClose, ModalDialog } from '@mui/joy'
import { useState } from 'react'

export function FullscreenDialog({
  openButton,
  children
}: {
  openButton: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Box onClick={() => setOpen(true)}>{openButton}</Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog layout="fullscreen">
          <ModalClose />
          <Box>{children}</Box>
        </ModalDialog>
      </Modal>
    </>
  )
}

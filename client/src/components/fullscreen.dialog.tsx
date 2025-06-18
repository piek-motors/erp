import { Box, Modal, ModalClose, ModalDialog } from '@mui/joy'

export function FullscreenDialog(props: {
  openButton: React.ReactNode
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
}) {
  return (
    <>
      <Box onClick={() => props.setOpen(true)}>{props.openButton}</Box>
      <Modal
        open={props.open}
        onClose={() => {
          props.setOpen(false)
        }}
      >
        <ModalDialog layout="fullscreen">
          <ModalClose variant="soft" color="danger" />
          <Box>{props.children}</Box>
        </ModalDialog>
      </Modal>
    </>
  )
}

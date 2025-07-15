import {
  Box,
  ModalClose,
  ModalDialog,
  ModalDialogProps,
  Modal as MuiModal
} from '@mui/joy'

export function InModal(props: {
  openButton: React.ReactNode
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  layout?: 'fullscreen' | 'center'
  size?: ModalDialogProps['size']
}) {
  return (
    <>
      <Box onClick={() => props.setOpen(true)}>{props.openButton}</Box>
      <MuiModal
        open={props.open}
        onClose={() => {
          props.setOpen(false)
        }}
      >
        <ModalDialog layout={props.layout} size={props.size}>
          <ModalClose variant="soft" color="danger" />
          <Box>{props.children}</Box>
        </ModalDialog>
      </MuiModal>
    </>
  )
}

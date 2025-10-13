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
  onClose?: () => void
  layout?: 'fullscreen' | 'center'
  size?: ModalDialogProps['size']
  width?: string
}) {
  // Use provided layout or default to responsive behavior
  const mobileLayout = props.layout || 'fullscreen'
  const desktopLayout = props.layout || 'center'

  return (
    <>
      <Box onClick={() => props.setOpen(true)}>{props.openButton}</Box>
      <MuiModal
        open={props.open}
        onClose={() => {
          props.setOpen(false)
          props.onClose?.()
        }}
      >
        <>
          {/* Mobile Modal */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <ModalDialog layout={mobileLayout} size={props.size}>
              <ModalClose variant="soft" color="warning" />
              <Box>{props.children}</Box>
            </ModalDialog>
          </Box>

          {/* Desktop Modal */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <ModalDialog
              layout={desktopLayout}
              size={'lg'}
              sx={{ width: props.width }}
            >
              <ModalClose variant="soft" color="warning" />
              <Box>{props.children}</Box>
            </ModalDialog>
          </Box>
        </>
      </MuiModal>
    </>
  )
}

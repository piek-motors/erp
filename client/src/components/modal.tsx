import { useIsMobile } from '@/hooks/use-media-query'
import {
  Box,
  ModalClose,
  ModalDialog,
  type ModalDialogProps,
  Modal as MuiModal,
  Stack,
} from '@mui/joy'

export function InModal(props: {
  openButton?: React.ReactNode
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

  const isMobile = useIsMobile()
  const layout = isMobile ? mobileLayout : desktopLayout
  return (
    <>
      {props.openButton && (
        <Box onClick={() => props.setOpen(true)}>{props.openButton}</Box>
      )}
      <MuiModal
        open={props.open}
        sx={{ overflow: 'auto' }}
        onClose={() => {
          props.setOpen(false)
          props.onClose?.()
        }}
      >
        <ModalDialog
          layout={layout}
          size={'lg'}
          sx={{
            width: props.width,
            pr: 6,
            overflowY: 'auto',
          }}
        >
          <ModalClose variant="solid" color="neutral" />
          <Stack>{props.children}</Stack>
        </ModalDialog>
      </MuiModal>
    </>
  )
}

import { UilBars } from '@iconscout/react-unicons'
import {
  Box,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack
} from '@mui/joy'
import { WebOnly } from 'components/utilities/conditional-display'
import { DesktopOnly, MobileOnly, P, Row, UseIcon } from 'lib/index'
import { useEffect, useState } from 'react'
import { cache } from './cache/root'
import { NavigationSideBar } from './shared/nav'

export const MobileNavModal = (props: { t?: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <MobileOnly>
      <Row>
        <IconButton
          variant="soft"
          color="primary"
          onClick={() => setOpen(true)}
          size="sm"
        >
          <UseIcon icon={UilBars} />
        </IconButton>
        <P color="primary" level="body-sm" fontWeight={600}>
          {props.t}
        </P>
      </Row>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog layout="fullscreen">
          <ModalClose />
          <NavigationSideBar />
        </ModalDialog>
      </Modal>
    </MobileOnly>
  )
}

export function MetalFlowRootLayout(props: { children?: React.ReactNode }) {
  useEffect(() => {
    cache.init()
  }, [])
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'start',
        flexDirection: {
          xs: 'column',
          sm: 'row'
        }
      }}
    >
      <DesktopOnly>
        <WebOnly>
          <NavigationSideBar />
        </WebOnly>
      </DesktopOnly>
      {props.children && (
        <Sheet sx={{ width: '100%', height: 'min-content' }}>
          <Stack sx={{ flexGrow: 1, gap: 1, overflowX: 'auto' }}>
            {props.children}
          </Stack>
        </Sheet>
      )}
    </Box>
  )
}

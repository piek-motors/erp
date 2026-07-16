import { MenuRounded } from '@mui/icons-material'
import {
  Box,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack,
} from '@mui/joy'
import { type ReactNode, useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import {
  DesktopOnly,
  MobileOnly,
  WebOnly,
} from '@/components/utilities/conditional-display'
import { P, Row, UseIcon } from '@/lib/index'
import { NavigationSideBar } from '../../components/nav_sidebar'
import { app_cache } from './cache'
import { nav_links } from './nav.links'

const title = 'ПДО'

export const MobileNavModal = (props: { t?: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <MobileOnly>
      <Row>
        <IconButton
          variant="soft"
          color="primary"
          onClick={() => setOpen(true)}
          size="md"
        >
          <UseIcon icon={MenuRounded} />
        </IconButton>
        <P level="body-sm" fontWeight={500}>
          {props.t}
        </P>
      </Row>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog layout="fullscreen" size="sm">
          <ModalClose />
          <NavigationSideBar
            gap={1}
            title={title}
            links={nav_links}
            onClick={() => setOpen(false)}
          />
        </ModalDialog>
      </Modal>
    </MobileOnly>
  )
}

export const MobilePadding = (props: {
  children: ReactNode
  desktop_too?: boolean
}) => (
  <Box
    sx={{
      p: {
        xs: 1,
        sm: props.desktop_too ? 1 : 0,
      },
    }}
  >
    {props.children}
  </Box>
)

export function MetalFlowRootLayout() {
  useEffect(() => {
    app_cache.init()
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: {
          xs: 'column',
          sm: 'row',
        },
      }}
    >
      <DesktopOnly>
        <WebOnly>
          <NavigationSideBar
            links={nav_links}
            title={title}
            p={0.5}
            sx={{
              borderRight: '1px solid #ddd',
            }}
          />
        </WebOnly>
      </DesktopOnly>
      <Sheet
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        }}
      >
        <Stack>
          <Outlet />
        </Stack>
      </Sheet>
    </Box>
  )
}

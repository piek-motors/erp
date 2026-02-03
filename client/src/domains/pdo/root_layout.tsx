import { UilBars } from '@iconscout/react-unicons'
import {
  Box,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack,
} from '@mui/joy'
import {
  DesktopOnly,
  MobileOnly,
  WebOnly,
} from 'components/utilities/conditional-display'
import { P, Row, UseIcon } from 'lib/index'
import { ReactNode, useEffect, useState } from 'react'
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
          <UseIcon icon={UilBars} />
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
        md: props.desktop_too ? 1 : 0,
      },
    }}
  >
    {props.children}
  </Box>
)

export function MetalFlowRootLayout(props: { children?: React.ReactNode }) {
  useEffect(() => {
    app_cache.init()
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
          sm: 'row',
        },
      }}
    >
      <DesktopOnly>
        <WebOnly>
          <NavigationSideBar
            links={nav_links}
            title={title}
            p={1}
            pr={0}
            sx={{
              background: 'lightgrey',
              height: 'inherit',
            }}
          />
        </WebOnly>
      </DesktopOnly>
      {props.children && (
        <Sheet sx={{ width: '100%', height: 'min-content' }}>
          <Stack sx={{ flexGrow: 1, overflowX: 'auto' }}>
            {props.children}
          </Stack>
        </Sheet>
      )}
    </Box>
  )
}

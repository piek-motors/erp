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
import {
  DesktopOnly,
  MobileOnly,
  WebOnly
} from 'components/utilities/conditional-display'
import { P, Row, UseIcon } from 'lib/index'
import { useEffect, useState } from 'react'
import { NavigationSideBar } from '../../components/nav_sidebar'
import { cache } from './cache/root'
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
        <P color="primary" level="body-sm" fontWeight={600}>
          {props.t}
        </P>
      </Row>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog layout="fullscreen">
          <ModalClose />
          <NavigationSideBar
            title={title}
            links={nav_links}
            onClick={() => setOpen(false)}
          />
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
          <NavigationSideBar
            links={nav_links}
            title={title}
            p={1}
            pr={0}
            sx={{
              background: 'lightgrey',
              height: 'inherit'
            }}
          />
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

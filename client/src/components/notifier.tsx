import { Alert, Box, Container, Stack } from '@mui/joy'
import { notifierStore } from 'lib/store/notifier.store'
import { observer } from 'mobx-react-lite'

export const NotifierOverlay = observer(() => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 1000
      }}
    >
      <Stack gap={1}>
        {notifierStore.all().map(each => (
          <Alert
            variant="solid"
            color={each.level === 'err' ? 'danger' : 'success'}
          >
            {' '}
            <Container maxWidth="sm">{each.msg}</Container>
          </Alert>
        ))}
      </Stack>
    </Box>
  )
})

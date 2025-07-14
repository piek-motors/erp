import { Alert, Box, Stack } from '@mui/joy'
import { notifierStore } from 'lib/store/notifier.store'
import { observer } from 'mobx-react-lite'

export const NotifierOverlay = observer(() => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 10,
        right: 10
      }}
    >
      <Stack gap={1}>
        {notifierStore.all().map(each => (
          <Alert
            variant="soft"
            color={each.level === 'err' ? 'danger' : 'success'}
          >
            {' '}
            {each.msg}
          </Alert>
        ))}
      </Stack>
    </Box>
  )
})

import { Alert, Box, Stack } from '@mui/joy'
import { useNotifier } from '../store/notifier.store'

export function NotifierOverlay() {
  const notifier = useNotifier()
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 10,
        right: 10
      }}
    >
      <Stack gap={1}>
        {notifier.all().map(each => (
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
}

import { Alert, Box, Container, Stack } from '@mui/joy'
import { notifier } from 'lib/store/notifier.store'
import { observer } from 'mobx-react-lite'
import { WebOnly } from './utilities/conditional-display'

export const NotifierOverlay = observer(() => {
  return (
    <WebOnly>
      <Box
        sx={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          zIndex: 1000
        }}
      >
        <Stack gap={1}>
          {notifier
            .all()
            .toReversed()
            .map(each => (
              <Alert
                key={each.id}
                variant="solid"
                size="sm"
                color={each.level === 'err' ? 'danger' : 'success'}
              >
                {' '}
                <Container maxWidth="sm">{each.msg}</Container>
              </Alert>
            ))}
        </Stack>
      </Box>
    </WebOnly>
  )
})

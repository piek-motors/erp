import { Box, Sheet, Stack } from 'lib'
import { ScrollPreserv } from '../utilities/scroll_preserve'

export const ScrollableWindow = ({
  staticContent,
  scrollableContent,
  refreshTrigger
}: {
  staticContent?: React.ReactNode
  scrollableContent: React.ReactNode
  refreshTrigger: any
}) => {
  return (
    <Stack sx={{ maxHeight: '100vh' }}>
      {staticContent ? <Stack py={1}>{staticContent}</Stack> : null}
      <ScrollPreserv refreshTrigger={refreshTrigger}>
        <Sheet sx={{ overflowX: 'auto' }}>
          <Box>{scrollableContent}</Box>
        </Sheet>
      </ScrollPreserv>
      <Box p={0.5}></Box>
    </Stack>
  )
}

import { Box, Stack } from 'lib/shortcuts'
import { ScrollPreserv } from './scroll-preserve'

export const ScrollableWindow = ({
  staticContent,
  scrollableContent,
  refreshTrigger
}: {
  staticContent: React.ReactNode
  scrollableContent: React.ReactNode
  refreshTrigger: any
}) => {
  return (
    <Stack sx={{ maxHeight: '100vh' }}>
      <Box p={1}></Box>
      <Stack>{staticContent}</Stack>
      <Box p={1}></Box>
      <ScrollPreserv refreshTrigger={refreshTrigger}>
        {scrollableContent}
      </ScrollPreserv>
      <Box p={1}></Box>
    </Stack>
  )
}

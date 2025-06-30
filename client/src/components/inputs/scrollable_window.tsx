import { Box, Sheet, Stack } from 'lib'
import { ScrollPreserv } from '../utilities/scroll_preserve'

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
      {staticContent ? (
        <>
          <Box p={0.6}></Box>
          <Stack>{staticContent}</Stack>
          <Box p={1}></Box>
        </>
      ) : null}
      <ScrollPreserv refreshTrigger={refreshTrigger}>
        <Sheet sx={{ borderRadius: 'sm' }}>{scrollableContent}</Sheet>
      </ScrollPreserv>
      <Box p={0.5}></Box>
    </Stack>
  )
}

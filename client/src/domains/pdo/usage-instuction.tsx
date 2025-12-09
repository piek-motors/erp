import { Stack } from '@mui/joy'
import { MobileOnly } from 'lib/index'
import { MobileNavigationLinks } from './shared/nav'

export function UsageInstruction() {
  return (
    <Stack spacing={4}>
      <MobileOnly>
        <MobileNavigationLinks />
      </MobileOnly>
    </Stack>
  )
}

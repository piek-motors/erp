import { MenuItem, Stack } from '@mui/joy'
import { Label, P } from 'lib/index'

const Pair = (props: { label?: string; value?: string | null }) => {
  if (!props.value) return null
  return (
    <MenuItem sx={{ display: 'flex', alignItems: 'baseline' }}>
      <Stack>
        {props.label && (
          <Label level="body-xs" color="warning">
            {props.label}
          </Label>
        )}
        <P>{props.value}</P>
      </Stack>
    </MenuItem>
  )
}

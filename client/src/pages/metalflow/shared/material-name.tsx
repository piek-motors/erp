import { Box, Stack } from '@mui/material'
import { P } from 'src/shortcuts'

type Flag = {
  color: number
  text: string
}

export interface ResourceNameProps {
  name: string
  caption?: string
  flags?: Flag[]
}

export function ResourceName(props: ResourceNameProps) {
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <pre>{props.name}</pre>
      <P variant="caption" sx={{ whiteSpace: 'nowrap' }}>
        {props.caption}
      </P>
      {props.flags?.map(each => (
        <Flag flag={each} />
      ))}
    </Stack>
  )
}

function Flag(props: { flag: Flag }) {
  return (
    <Box
      sx={{
        backgroundColor: `var(--L${props.flag.color})`,
        padding: '0 4px',
        borderRadius: '4px'
      }}
    >
      <P variant="caption">{props.flag.text}</P>
    </Box>
  )
}

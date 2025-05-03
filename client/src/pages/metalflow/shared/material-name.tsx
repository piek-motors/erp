import { Box, Stack } from '@mui/material'
import { Btn, P } from 'src/shortcuts'

type Flag = {
  color: number
  text: string
}

export interface ResourceNameProps {
  name?: string
  caption?: string
  flags?: Flag[]
}

export function ResourceName(props: {
  resource?: ResourceNameProps
  onClick?: () => void
}) {
  const { resource } = props

  if (!resource) return <> Null resource name </>
  const raw = (
    <Stack direction="row" gap={1} alignItems="center">
      <pre>{resource.name}</pre>
      <P variant="caption" sx={{ whiteSpace: 'nowrap' }}>
        {resource.caption}
      </P>
      {resource.flags?.map(each => (
        <Flag flag={each} />
      ))}
    </Stack>
  )

  if (props.onClick) {
    return (
      <Btn variant="text" onClick={props.onClick} sx={{ width: '100%' }}>
        {raw}
      </Btn>
    )
  }

  return raw
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

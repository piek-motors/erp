import { Box, Stack, Typography } from '@mui/joy'
import { Btn } from 'shortcuts'

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
      <Typography>{resource.name}</Typography>
      <Typography sx={{ whiteSpace: 'nowrap' }}>{resource.caption}</Typography>
      {resource.flags?.map(each => (
        <Flag flag={each} key={each.text} />
      ))}
    </Stack>
  )

  if (props.onClick) {
    return (
      <Btn onClick={props.onClick} sx={{ width: '100%' }}>
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
      <Typography>{props.flag.text}</Typography>
    </Box>
  )
}

import { UilHome } from '@iconscout/react-unicons'
import { Box, IconButton, Stack } from '@mui/material'
import { Link } from 'react-router-dom'
import { SxProperty } from 'src/lib/constants'
import { P } from 'src/shortcuts'

export interface Props {
  icon?: JSX.Element
  title: string
  sx?: SxProperty
}

export function PageTitle(props: Props) {
  return (
    <Stack direction="row" sx={{ ...props.sx, gap: 1, alignItems: 'center' }}>
      <GoHomeBtn />
      <Box display="flex" gap={1} sx={{ color: 'var(--accent)' }}>
        {props.icon}
        <P color={'var(--accent)'} fontWeight={700}>
          {props.title}
        </P>
      </Box>
    </Stack>
  )
}

{
  /* opne mobile navigation menu */
}
export function GoHomeBtn() {
  return (
    <Link to="/help">
      <IconButton
        size="small"
        sx={{
          display: {
            xs: 'flex',
            sm: 'none'
          }
        }}
      >
        <UilHome />
      </IconButton>
    </Link>
  )
}

import { UilHome } from '@iconscout/react-unicons'
import { Box, IconButton, Stack, Typography } from '@mui/joy'
import { Link } from 'react-router-dom'
import { SxProperty } from 'src/lib/constants'

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
        <Typography fontWeight={700}>{props.title}</Typography>
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

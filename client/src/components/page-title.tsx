import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/joy'
import { Link } from 'react-router-dom'
import { SxProperty } from 'src/lib/constants'
import { Row } from '../shortcuts'

export interface Props {
  title: string
  sx?: SxProperty
  children?: JSX.Element
}

export function PageTitle(props: Props) {
  return (
    <Stack direction="row" gap={2} p={1}>
      <Tooltip title="Перейти на главную страницу">
        <Link to="/help">
          <IconButton variant="soft" color="primary">
            <img src={'/favicon.ico'} width={20} height={20} />
          </IconButton>
        </Link>
      </Tooltip>

      <Row gap={3}>
        <Typography color="primary" fontWeight={600}>
          {props.title}
        </Typography>
        <Box sx={{ marginLeft: 'auto' }}>{props.children}</Box>
      </Row>
    </Stack>
  )
}

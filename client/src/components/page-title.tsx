import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/joy'
import { Link } from 'react-router-dom'
import { SxProperty } from 'src/lib/constants'
import { Row } from '../shortcuts'

export interface Props {
  title: string
  subTitle?: string | null
  sx?: SxProperty
  children?: JSX.Element
}

export function PageTitle(props: Props) {
  return (
    <Stack direction="row" gap={2} p={1}>
      <Tooltip title="Перейти на главную страницу">
        <Link to="/help">
          <IconButton variant="outlined">
            <img src={'/favicon.ico'} width={20} height={20} />
          </IconButton>
        </Link>
      </Tooltip>

      <Row gap={2}>
        <Typography color="primary" fontWeight={600}>
          {props.title}
        </Typography>
        {props.subTitle && (
          <Typography level="body-md">{props.subTitle}</Typography>
        )}
        <Box sx={{ marginLeft: 'auto' }}>{props.children}</Box>
      </Row>
    </Stack>
  )
}

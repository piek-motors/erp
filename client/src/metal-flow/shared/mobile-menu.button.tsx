import { UilBars } from '@iconscout/react-unicons'
import { Box, IconButton } from '@mui/joy'
import { routeMap } from 'lib/routes'
import { Link, UseIcon } from 'lib/shortcuts'

export const MobileMenuButton = () => {
  return (
    <Box>
      <Link to={routeMap.metalflow.index}>
        <IconButton variant="soft">
          <UseIcon icon={UilBars} />
        </IconButton>
      </Link>
    </Box>
  )
}

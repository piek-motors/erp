import { UilBars } from '@iconscout/react-unicons'
import { Box, IconButton } from '@mui/joy'
import { Link, UseIcon } from 'lib/index'
import { routeMap } from 'lib/routes'

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

import { UilSearch } from '@iconscout/react-unicons'
import { Button } from '@mui/joy'
import { UseIcon } from 'lib/index'

export const WriteoffOpenListButton = () => {
  return (
    <Button
      variant="soft"
      color={'warning'}
      startDecorator={<UseIcon icon={UilSearch} small />}
    >
      Список
    </Button>
  )
}

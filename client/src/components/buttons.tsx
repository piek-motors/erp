import { Icon } from '@iconscout/react-unicons'
import { IconButton, IconButtonProps } from '@mui/joy'
import { UseIcon } from 'lib/index'
import { Link } from 'react-router-dom'

export const ExtraSmallIconButton = (props: {
  icon: Icon
  link?: string
  buttonProps?: IconButtonProps
}) => {
  const btn = (
    <IconButton
      sx={{ minWidth: '22px', minHeight: '22px' }}
      variant="solid"
      color="neutral"
      size="sm"
      {...props.buttonProps}
    >
      <UseIcon icon={props.icon} small invert />
    </IconButton>
  )

  return props.link ? (
    <Link to={props.link} onClick={e => e.stopPropagation()}>
      {btn}
    </Link>
  ) : (
    btn
  )
}

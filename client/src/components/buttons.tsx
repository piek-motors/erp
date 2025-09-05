import { Icon } from '@iconscout/react-unicons'
import { IconButton, IconButtonProps } from '@mui/joy'
import { UseIcon } from 'lib/index'
import { Link } from 'react-router'

export const ExtraSmallIconButton = (props: {
  icon: Icon
  link?: string
  buttonProps?: IconButtonProps
}) => {
  const btn = (
    <IconButton
      variant="soft"
      color="neutral"
      size="sm"
      {...props.buttonProps}
      sx={{ border: '1px solid', borderColor: 'grey' }}
    >
      <UseIcon icon={props.icon} small />
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

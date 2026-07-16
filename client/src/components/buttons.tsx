import { type Icon, UilArrowLeft } from '@iconscout/react-unicons'
import { IconButton, type IconButtonProps } from '@mui/joy'
import { Link } from 'react-router'
import { UseIcon } from '@/lib/index'

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

export const BackIconButton = (props: {
  link?: string
  onClick?: IconButtonProps['onClick']
  buttonProps?: IconButtonProps
}) => {
  const btn = (
    <IconButton
      aria-label="Назад"
      title="Назад"
      variant="soft"
      color="primary"
      size="sm"
      onClick={props.onClick}
      {...props.buttonProps}
    >
      <UseIcon icon={UilArrowLeft} />
    </IconButton>
  )

  return props.link ? <Link to={props.link}>{btn}</Link> : btn
}

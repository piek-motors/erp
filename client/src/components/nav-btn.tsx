import { Button, ButtonProps } from '@mui/joy'
import { Link } from 'react-router'

export const NavBtn = (
  props: { to: string; children: React.ReactNode } & ButtonProps
) => {
  return (
    <Link to={props.to}>
      <Button
        {...props}
        variant="outlined"
        color="neutral"
        sx={{
          textAlign: 'left',
          lineHeight: 1,
          width: 'max-content',
          ...props.sx
        }}
      >
        {props.children}
      </Button>
    </Link>
  )
}

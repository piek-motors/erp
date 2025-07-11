import { Container, ContainerProps } from '@mui/joy'
import { JSX } from 'react'
import { SxProperty } from '../../lib/constants'

export function CenteredContainer(props: {
  children?: JSX.Element
  containerProps?: ContainerProps
  maxWidth?: ContainerProps['maxWidth']
  sx?: SxProperty
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <Container
        {...props.containerProps}
        maxWidth={props.maxWidth}
        sx={props.sx}
      >
        {props.children}
      </Container>
    </div>
  )
}

import { Container, type ContainerProps } from '@mui/joy'
import type { JSX } from 'react'
import type { SxProperty } from '../../lib/constants'

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
				height: '100%',
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

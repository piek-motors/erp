import { Stack } from '@mui/joy'
import type { ReactNode } from 'react'
import { NavTopBar } from './nav_topbar'

export const FactoryPage = (props: {
	title: string
	header?: ReactNode
	children: ReactNode
}) => {
	return (
		<Stack gap={1} p={1} sx={{ overflow: 'auto' }}>
			<NavTopBar t={props.title}>{props.header}</NavTopBar>
			<Stack gap={1}>{props.children}</Stack>
		</Stack>
	)
}

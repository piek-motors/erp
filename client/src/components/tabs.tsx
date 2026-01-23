import {
	Tabs as MuiTabs,
	Tab,
	TabList,
	type TabListProps,
	TabPanel,
	type TabsProps,
} from '@mui/joy'
import type { ReactNode } from 'react'

export type TabConfig = {
	value: string | number
	label: string
	component: ReactNode
}[]

export type TabProps = {
	handleChange?: (newVal: any) => void
	tabs: TabConfig
	p?: number
	slots?: {
		tabList: TabListProps
	}
} & TabsProps

export function Tabs(props: TabProps) {
	return (
		<MuiTabs
			{...props}
			sx={{ borderRadius: 'sm', minWidth: 'fit-content', ...props.sx }}
			onChange={(e, v) => {
				if (v == null) return
				if (props.handleChange) {
					props.handleChange(v)
				}
			}}
		>
			<TabList {...props.slots?.tabList}>
				{props.tabs.map(({ value, label }) => (
					<Tab
						key={value}
						color={props.value === value ? 'primary' : 'neutral'}
						variant={props.value === value ? 'soft' : 'plain'}
					>
						{label}
					</Tab>
				))}
			</TabList>
			{props.tabs.map(({ value, component }) => (
				<TabPanel key={value} value={value} sx={{ p: props.p }}>
					{component}
				</TabPanel>
			))}
		</MuiTabs>
	)
}

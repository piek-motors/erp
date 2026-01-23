import { UilPlusCircle } from '@iconscout/react-unicons'
import {
	Box,
	Button,
	type ButtonProps,
	IconButton,
	Stack,
	type StackProps,
} from '@mui/joy'
import { NavTopBar } from 'components/nav_topbar'
import { UseIcon } from 'lib/index'
import { Link, useLocation } from 'react-router'

export type Link = {
	name?: string
	href: string
	childres?: Link[]
	endBlock?: Link[]
}

export const NavigationSideBar = (
	props: StackProps & {
		title: string
		links: Link[]
	},
) => (
	<Stack gap={0.5} {...props}>
		<NavTopBar t={props.title} />
		{props.links.map(each => (
			<RenderAction action={each} key={each.href} size="sm" />
		))}
	</Stack>
)

const RenderAction = (props: { action: Link; size: ButtonProps['size'] }) => {
	const { action, size } = props
	return (
		<Stack
			direction="row"
			alignItems={'center'}
			sx={{ cursor: 'pointer' }}
			justifyContent={'space-between'}
		>
			<MenuButton href={action.href} name={action.name} size={size} />
			<Box>
				{action.endBlock?.length && (
					<Stack>
						{action.endBlock?.map(e => (
							<LinkableIcon href={e.href} small key={e.href} />
						))}
					</Stack>
				)}
			</Box>
		</Stack>
	)
}

function MenuButton(props: {
	href: string
	name?: string
	size: ButtonProps['size']
}) {
	const location = useLocation()
	const isActive = location.pathname === props.href
	return (
		<Link to={props.href} key={props.href}>
			<Button
				sx={{ textAlign: 'left', lineHeight: 1, width: 'min-content' }}
				variant={isActive ? 'soft' : 'plain'}
				color={'neutral'}
				size={'sm'}
			>
				{props.name}
			</Button>
		</Link>
	)
}

const LinkableIcon = (props: { href: string; small?: boolean }) => (
	<Box key={props.href}>
		<Link to={props.href} key={props.href}>
			<IconButton
				size="sm"
				variant={props.href === useLocation().pathname ? 'soft' : 'plain'}
			>
				<UseIcon icon={UilPlusCircle} small />
			</IconButton>
		</Link>
	</Box>
)

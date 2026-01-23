/** @jsxImportSource @emotion/react */
import type { SxProps } from '@mui/joy/styles/types'
import { app_cache } from 'domains/pdo/cache'
import { Box, Link, observer, P, Row } from 'lib/index'
import { openPage, routeMap } from 'lib/routes'

interface Detail {
	id: number
	name: string
	group_id: number | null
}

interface Props {
	detail: Detail
	withGroupName?: boolean
	disableLink?: boolean
	sx?: SxProps
}

const capitalizeFirstLetter = (str: string): string => {
	if (str.length < 2) return str
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const DetailName = observer((props: Props) => {
	const { detail, withGroupName } = props
	const l = (
		<Row gap={1} rowGap={0} flexWrap={'wrap'}>
			<P sx={props.sx}>{capitalizeFirstLetter(detail.name)}</P>
			{withGroupName && <GroupName groupId={detail.group_id} />}
		</Row>
	)
	if (props.disableLink) {
		return l
	}
	return (
		<Box width={'fit-content'}>
			<Link to={openPage(routeMap.pdo.detail.edit, detail.id)}>{l}</Link>
		</Box>
	)
})

const GroupName = observer(({ groupId }: { groupId: number | null }) => {
	if (!groupId) return null
	const groupName = app_cache.detailGroups.getGroupName(groupId)
	return (
		<P
			color="primary"
			sx={{ cursor: 'pointer', fontSize: '0.9em', fontWeight: '500' }}
		>
			{groupName?.toLowerCase() || ''}
		</P>
	)
})

import { Divider } from '@mui/joy'
import { ScrollableWindow } from 'components/inputs'
import {
	DesktopOnly,
	MobileOnly,
} from 'components/utilities/conditional-display'
import { Box, Loading, observer, P, Row, Stack, useEffect } from 'lib/index'
import { useParams } from 'react-router'
import { MobileNavModal, MobilePadding } from '../root_layout'
import { api } from './api'
import { GroupActions, TargetGroupDetailList } from './detail_list'
import { GroupSelectModal, SharedGroupList } from './group_list'
import { UpdateGroupNameModal } from './group_name.modal'

const DetailsPanel = observer(() => {
	if (api.targetGroupLoading.loading) return <Loading />
	const openedGroup = api.store.openedGroup
	if (!openedGroup)
		return (
			<P level="body-sm" p={2}>
				Выберите группу
			</P>
		)
	return (
		<ScrollableWindow
			scroll={
				openedGroup && (
					<Stack p={1} gap={1}>
						<Row>
							<UpdateGroupNameModal />
							<GroupActions />
						</Row>
						<TargetGroupDetailList />
					</Stack>
				)
			}
		/>
	)
})

const DetailGroupsLayout = observer(() => (
	<Stack
		direction={{
			xs: 'column',
			sm: 'row',
		}}
		sx={{
			gap: 0.5,
		}}
	>
		{/* Group list */}
		<Box>
			<MobileOnly>
				<MobilePadding>
					<Row>
						<MobileNavModal />
						<GroupSelectModal />
					</Row>
				</MobilePadding>
			</MobileOnly>
			<DesktopOnly>
				<ScrollableWindow scroll={<SharedGroupList />} />
			</DesktopOnly>
		</Box>
		{/* Group details */}
		<Divider orientation="vertical" />
		<DetailsPanel />
	</Stack>
))

export const DetailGroupById = observer(() => {
	const { id } = useParams<{ id: string }>()
	useEffect(() => {
		if (id) {
			const groupId = parseInt(id, 10)
			if (!isNaN(groupId)) {
				api.loadGroupWithDetails(groupId)
			}
		}
		return () => {
			api.store.clear()
		}
	}, [id])

	return <DetailGroupsLayout />
})

export const DetailGroupListPage = observer(() => {
	useEffect(() => {
		api.listGroups()
		return () => {
			api.store.clear()
		}
	}, [])
	return <DetailGroupsLayout />
})

import { Divider } from '@mui/joy'
import type { SxProps } from '@mui/joy/styles/types'
import { ScrollableWindow } from 'components/inputs'
import { SearchWithCriteria } from 'components/inputs/search_input_with_criteria'
import { InModal } from 'components/modal'
import { SearchResults } from 'components/search-paginated'
import { Table } from 'components/table.impl'
import { MobileNavModal, MobilePadding } from 'domains/pdo/root_layout'
import {
	Box,
	Label,
	Loading,
	observer,
	openPage,
	routeMap,
	Row,
	Stack,
	useNavigate,
	useState,
} from 'lib/index'
import type { ReactNode } from 'react'
import type { Column } from 'react-table'
import type { DetailSt } from '../detail.state'
import { DetailName } from '../name'
import { AlphabetIndex } from './alphabet_index'
import { DetailSearchCriteria, detailListStore as state } from './store'

export const DetailsListPage = () => (
	<ScrollableWindow
		static={
			<MobilePadding desktop_too>
				<Stack gap={0.5}>
					<MobileNavModal t={'Детали'} />
					<Search />
				</Stack>
			</MobilePadding>
		}
		scroll={
			<Row alignItems="start" gap={0} mb={2} flexWrap={'nowrap'}>
				<AlphabetIndex sx={{ position: 'sticky', top: 0, zIndex: 1 }} />
				<Divider orientation="vertical" />
				<DetailsList sx={{ width: '100%' }} />
			</Row>
		}
	/>
)

const Search = observer(() => (
	<SearchWithCriteria
		variant="soft"
		color="primary"
		criteriaOptions={DetailSearchCriteria}
		criteria={state.search_criteria}
		onCriteriaChange={c => state.set_search_criteria(c)}
		query={state.query ?? ''}
		onQueryChange={v => state.set_query(v)}
	/>
))

const columnList: Column<DetailSt>[] = [
	{
		Header: '№',
		accessor: d => <Label xs>{d.id}</Label>,
	},
	{
		Header: 'Наименование',
		id: 'name',
		accessor: r => (
			<DetailName
				detail={{
					id: r.id || 0,
					name: r.name,
					group_id: r.groupId || null,
				}}
				disableLink
				withGroupName
			/>
		),
	},
	{
		Header: 'Остаток',
		accessor: r => {
			if (!r.warehouse.stock) return ''
			return r.warehouse.stock
		},
	},
]

interface DetailsTableProps {
	onRowClick?: (row: DetailSt) => void
	highlight?: (row: DetailSt) => boolean
	highlightColor?: string
	sx?: SxProps
}

const DetailList = observer((props: DetailsTableProps) => {
	const navigate = useNavigate()
	return (
		<Table
			sx={props.sx}
			columns={columnList}
			data={state.displayed_results}
			rowStyleCb={row => {
				if (props.highlight) {
					return props.highlight(row.original)
						? { backgroundColor: props.highlightColor }
						: {}
				}
				return {}
			}}
			onRowClick={row => {
				if (props.onRowClick) {
					props.onRowClick(row)
				} else {
					navigate(openPage(routeMap.pdo.detail.edit, row.id))
				}
			}}
		/>
	)
})

interface DetailSelectModalProps {
	value?: DetailSt
	onRowClick: (row: DetailSt) => void
	openButton: ReactNode
}

export const DetailSelectModal = observer((props: DetailSelectModalProps) => {
	const [opnen, setOpen] = useState(false)
	return (
		<InModal
			layout="fullscreen"
			open={opnen}
			setOpen={() => setOpen(!opnen)}
			openButton={props.openButton}
		>
			<ScrollableWindow
				refreshTrigger={false}
				scroll={
					<Box p={1} mb={3}>
						<Search />
						<DetailsList
							onRowClick={v => {
								props.onRowClick(v)
								setOpen(false)
							}}
						/>
					</Box>
				}
			/>
		</InModal>
	)
})

const DetailsList = observer((props: DetailsTableProps) => (
	<Stack gap={1} sx={props.sx}>
		{state.loader.loading && <Loading />}
		<SearchResults store={state.searchStore} emptyMessage="Детали не найдены">
			<DetailList
				highlight={props.highlight}
				highlightColor={props.highlightColor}
				onRowClick={props.onRowClick}
			/>
		</SearchResults>
	</Stack>
))

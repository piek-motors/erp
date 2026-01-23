import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import type { TabConfig } from 'components/tabs'
import { MobileNavModal } from 'domains/pdo/root_layout'
import { observer } from 'lib/deps'
import {
	Label,
	Loading,
	openPage,
	Row,
	routeMap,
	Stack,
	useEffect,
	useNavigate,
} from 'lib/index'
import {
	ManufacturingOrderStatus,
	ManufacturingOrderStatus as OrderStatus,
} from 'models'
import type { ListOrdersOutput } from 'srv/rpc/pdo/orders'
import { getColumns } from './columns'
import { archive_search, s } from './store'

const getTabConfig = (
	data: ListOrdersOutput[],
	onRowClick: (row: ListOrdersOutput) => void,
): TabConfig => [
	{
		value: OrderStatus.Preparation,
		label: 'Подготовка',
		component: (
			<Stack>
				<Label px={1}>Подготовка</Label>
				<Table
					onRowClick={onRowClick}
					data={data.filter(e => e.status == OrderStatus.Preparation)}
					columns={getColumns(OrderStatus.Preparation)}
				/>
				<Label px={1}>Ожидание</Label>
				<Table
					onRowClick={onRowClick}
					data={data.filter(e => e.status == OrderStatus.Waiting)}
					columns={getColumns(OrderStatus.Waiting)}
				/>
			</Stack>
		),
	},
	{
		value: OrderStatus.Production,
		label: 'Производство',
		component: (
			<>
				<Label xs px={1}>
					{data.filter(e => e.status == OrderStatus.Production).length} заказов
				</Label>
				<Table
					onRowClick={onRowClick}
					data={data.filter(e => e.status == OrderStatus.Production)}
					columns={getColumns(OrderStatus.Production)}
				/>
			</>
		),
	},
	{
		value: OrderStatus.Collected,
		label: 'Архив',
		component: <ArchiveSearch data={data} onRowClick={onRowClick} />,
	},
]

const ArchiveSearch = observer(
	(props: {
		data: ListOrdersOutput[]
		onRowClick: (row: ListOrdersOutput) => void
	}) => {
		useEffect(() => {
			archive_search.init()
		}, [])

		return (
			<>
				{archive_search.show_last_archived_orders && (
					<Label xs px={1}>
						За последние 30 дней
					</Label>
				)}
				<Table
					onRowClick={props.onRowClick}
					data={archive_search.orders_to_render}
					columns={getColumns(OrderStatus.Collected)}
				/>
				{archive_search.loader.loading && (
					<Label xs px={1}>
						Загрузка...
					</Label>
				)}
			</>
		)
	},
)

export const ManufacturingList = observer(() => {
	const navigate = useNavigate()

	useEffect(() => {
		s.load()
	}, [])

	const onRowClick = (row: ListOrdersOutput) => {
		navigate(openPage(routeMap.pdo.order.edit, row.id))
	}

	if (s.async.loading) return <Loading />
	const tabs = getTabConfig(s.filtered, onRowClick)

	const search =
		s.tab === ManufacturingOrderStatus.Collected ? (
			<Search
				size="sm"
				variant="soft"
				color="primary"
				value={archive_search.query}
				onChange={e => archive_search.setQuery(e.target.value)}
			/>
		) : (
			<Search
				size="sm"
				variant="soft"
				color="primary"
				value={s.query}
				onChange={e => s.setQuery(e.target.value)}
			/>
		)

	return (
		<Tabs
			variant="plain"
			value={s.tab}
			onChange={(_, v) => s.setTab(v as OrderStatus)}
			size="sm"
		>
			<ScrollableWindow
				static={
					<Stack gap={0.5}>
						<MobileNavModal t={'Производство'} />
						<TabList variant="soft" color="primary">
							{tabs.map(({ value, label }) => (
								<Tab
									indicatorInset
									indicatorPlacement="top"
									key={value}
									value={value}
									color={'primary'}
									variant={s.tab == value ? 'outlined' : 'plain'}
								>
									{label}
								</Tab>
							))}
						</TabList>
						<Row gap={0} px={1}>
							{search}
						</Row>
					</Stack>
				}
				scroll={
					<Stack gap={0} pt={0} sx={{ mb: 2 }}>
						{tabs.map(({ value, component }) => (
							<TabPanel key={value} value={value} sx={{ p: 0 }}>
								{component}
							</TabPanel>
						))}
					</Stack>
				}
			/>
		</Tabs>
	)
})

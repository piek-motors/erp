import { DetailName } from 'domains/pdo/detail/detail_name'
import { Label, P } from 'lib/index'
import { timeDeltaDays } from 'lib/utils/date_fmt'
import { ManufacturingOrderStatus as Status } from 'models'
import type { Column } from 'react-table'
import type { ListOrdersOutput } from 'srv/domains/pdo/orders'

const commonColumns: Column<ListOrdersOutput>[] = [
	{
		Header: '№',
		accessor: m => <Label level="body-xs">{m.id}</Label>,
	},
	{
		Header: 'Деталь',
		accessor: d => (
			<DetailName
				detail={{
					id: d.detail_id,
					name: d.detail_name,
					group_id: d.group_id,
				}}
				disableLink
				withGroupName
			/>
		),
	},
	{
		Header: 'Кол-во',
		accessor: ({ qty }) => (qty ? <P>{qty}</P> : ''),
	},
]

const preparationColumns = commonColumns.concat([
	{
		Header: 'Создан',
		accessor: m => (
			<P noWrap level="body-xs">
				{m.created_at}
			</P>
		),
	},
])

const productionColumns = commonColumns.concat([
	{
		Header: 'Запуск',
		accessor: m => (
			<P noWrap level="body-xs">
				{m.started_at}
			</P>
		),
	},
	{
		Header: 'Операция',
		accessor: m => <P level="body-xs">{m.current_operation}</P>,
	},
	{
		Header: '_',
		accessor: m => {
			const timedelta = timeDeltaDays(m.current_operation_start_at)
			return (
				<>
					{timedelta && (
						<P level="body-xs" noWrap>
							{timedelta.replace('-', '')}
						</P>
					)}
				</>
			)
		},
	},
])

const finishColumns = commonColumns.concat([
	{
		Header: 'Выход',
		accessor: ({ output_qty }) => (output_qty ? <P>{output_qty}</P> : ''),
	},
	{
		Header: 'Запуск',
		accessor: m => (
			<P noWrap level="body-xs">
				{m.started_at}
			</P>
		),
	},
	{
		Header: 'Финиш',
		accessor: m => (
			<P noWrap level="body-xs">
				{m.finished_at}
			</P>
		),
	},
	{
		Header: 'Дельта',
		accessor: m => {
			if (!m.time_delta) return ''
			const totalDays = Math.round(m.time_delta / (3600 * 24))
			return (
				<P noWrap level="body-xs">
					{totalDays} д.
				</P>
			)
		},
	},
])

export function getColumns(status: Status) {
	switch (status) {
		case Status.Waiting:
		case Status.Preparation:
			return preparationColumns
		case Status.Production:
			return productionColumns
		case Status.Collected:
			return finishColumns
		default:
			return commonColumns
	}
}

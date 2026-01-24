import { Button, Label, Link, openPage, Row, routeMap } from 'lib/index'
import {
	OperationType,
	type SupplyReason,
	uiSupplyReason,
	uiWriteoffReason,
	type WriteoffReason,
} from 'models'
import type { Column } from 'react-table'
import { DetailName } from '../detail/name'
import { AdaptiveNumberFormatter } from '../shared/adaptive_number_formatter'
import { value_with_unit } from '../shared/basic'
import type { Operation } from './list'
import { OperationName } from './operation_name'

const formatter = new AdaptiveNumberFormatter(2)

export const columns: Column<Operation>[] = [
	{
		Header: 'Дата',
		accessor: data => (
			<Label level="body-xs" whiteSpace={'nowrap'}>
				{data.timestamp}
			</Label>
		),
	},
	{
		Header: `Объект`,
		id: 'name',
		accessor: data => <OperationName operation={data} />,
	},
	{
		Header: 'Кол-во',
		accessor: data => {
			const sign = data.operation_type == OperationType.Supply ? '+' : '-'
			return (
				<Row whiteSpace={'nowrap'} gap={0.3}>
					<Label>{sign}</Label>{' '}
					{value_with_unit(formatter.format(data.qty), data.unit)}
				</Row>
			)
		},
	},
	{
		Header: 'Деталь',
		accessor: data => {
			if (!data.detail_id || !data.material_id) return null
			return (
				<DetailName
					sx={{ whiteSpace: 'wrap', width: 'auto' }}
					detail={{
						id: data.detail_id,
						name: data.detail_name!,
						group_id: data.detail_group_id!,
					}}
					withGroupName
				/>
			)
		},
	},
	{
		Header: 'Заказ',
		accessor: data =>
			data.manufacturing_order_id && (
				<Link
					to={openPage(routeMap.pdo.order.edit, data.manufacturing_order_id)}
				>
					<Button
						variant="soft"
						size="sm"
						color="neutral"
						sx={{
							fontWeight: 'normal',
							fontSize: '0.7rem',
							whiteSpace: 'nowrap',
							p: 0.5,
						}}
					>
						№{data.manufacturing_order_id} {' ⇥ '}
						{data.manufacturing_order_qty} шт.
					</Button>
				</Link>
			),
	},
	{
		Header: 'Тип операции',
		accessor: data => {
			const isSupply = Number(data.operation_type) === OperationType.Supply
			const op = isSupply
				? uiSupplyReason(data?.reason as SupplyReason)
				: uiWriteoffReason(data?.reason as WriteoffReason)
			return <Label xs>{op}</Label>
		},
	},
]

import { Divider } from '@mui/joy'
import { NumberInput } from 'components/inputs/number_input'
import { value_with_unit } from 'domains/pdo/shared'
import {
	SupplyReasonSelect,
	WriteoffReasonSelect,
} from 'domains/pdo/shared/reason-select'
import {
	SupplyCompletedText,
	WarehouseCard,
	WriteoffCompletedText,
} from 'domains/pdo/warehouse/card'
import { OperationsListModal } from 'domains/pdo/warehouse/modals'
import { modalState } from 'domains/pdo/warehouse/modals.store'
import { ActionButton, Box, Label, observer, P, Row } from 'lib/index'
import { notifier } from 'lib/store/notifier.store'
import { Unit } from 'models'
import type { DetailSt, DetailStProp } from '../detail.state'

const CreateWarehouseDetailOperation = observer(
	(props: {
		detail: DetailSt
		reasonComponent: React.ReactNode
		onSubmit: () => Promise<unknown>
	}) => {
		const { detail } = props
		return (
			<>
			
				<Row flexWrap={'wrap'}>
					<P>{detail.name}</P>
					<Divider orientation='vertical'/>
					<Label>Остаток</Label> {value_with_unit(detail.warehouse.stock, Unit.Countable, { fraction_digits: 0})}
				</Row>
				<NumberInput
					label="Кол-во"
					autoFocus
					type="number"
					sx={{ width: '100px' }}
					value={detail.warehouse.qty}
					onChange={val => detail.warehouse.setQty(Number(val))}
				/>
				{props.reasonComponent}
				<Box pt={2}>
					<ActionButton
						onClick={() => props.onSubmit()}
						disabled={!detail.warehouse.qty}
					/>
				</Box>
			</>
		)
	},
)

export const DetailWarehouse = observer(({ detail }: DetailStProp) => (
	<WarehouseCard
		stock={value_with_unit(detail.warehouse.stock, Unit.Countable, { fraction_digits: 0})}
		writeoff={
			<CreateWarehouseDetailOperation
				detail={detail}
				reasonComponent={
					<WriteoffReasonSelect
						reason={detail.warehouse.writeoff.reason}
						setReason={reason => detail.warehouse.writeoff.setReason(reason)}
					/>
				}
				onSubmit={() =>
					detail.warehouse
						.insertWriteoff(detail.id)
						.then(() => {
							notifier.ok(WriteoffCompletedText)
						})
						.finally(() => {
							modalState.setWriteoff(false)
						})
				}
			/>
		}
		supply={
			<CreateWarehouseDetailOperation
				detail={detail}
				reasonComponent={
					<SupplyReasonSelect
						reason={detail.warehouse.supply.reason}
						setReason={reason => detail.warehouse.supply.setReason(reason)}
					/>
				}
				onSubmit={() =>
					detail.warehouse
						.insertSupply(detail.id)
						.then(() => {
							notifier.ok(SupplyCompletedText)
						})
						.finally(() => {
							modalState.setSupply(false)
						})
				}
			/>
		}
	>
		<OperationsListModal detailId={detail.id} />
	</WarehouseCard>
))

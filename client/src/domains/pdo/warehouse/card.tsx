import { Box, Card, type CardProps, Stack } from '@mui/joy'
import { Btn, observer, P, Row } from 'lib/index'
import type { ReactNode } from 'react'
import { OperationModal } from './modals'
import { modalState } from './modals.store'

interface Props {
	children: ReactNode
	stock: ReactNode
	supply: ReactNode
	writeoff: ReactNode
	cardProps?: CardProps
}

export const SupplyCompletedText = 'Поставка зарегистрирована'
export const WriteoffCompletedText = 'Списание зарегистрировано'

const supply_text = 'Поставка'
const writeoff_text = 'Списание'

export const WarehouseCard = observer((props: Props) => (
	<Card
		variant="soft"
		size="sm"
		color="primary"
		sx={{
			width: 'fit-content',
			gap: 0.5,
			height: 'inherit',
			flexDirection: 'row',
			...props.cardProps?.sx,
		}}
		{...props.cardProps}
	>
		<Row justifyContent={'center'}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 1,
				}}
			>
				<img
					src="/icons/warehouse.svg"
					width={20}
					height={20}
					style={{ opacity: 0.5 }}
				/>
			</Box>
			{props.stock}
		</Row>
		<OperationModal
			openButton={
				<Btn variant="soft" color={'success'} fullWidth size="md">
					{supply_text}
				</Btn>
			}
			open={modalState.supply}
			setOpen={o => {
				modalState.setSupply(o)
			}}
		>
			<P color="success" fontWeight={600}>
				{supply_text}
			</P>
			<Stack gap={1} my={1}>
				{props.supply}
			</Stack>
		</OperationModal>

		<OperationModal
			openButton={
				<Btn variant="soft" color={'warning'} fullWidth size="md">
					{writeoff_text}
				</Btn>
			}
			open={modalState.writeoff}
			setOpen={o => modalState.setWriteoff(o)}
		>
			<P color="warning" fontWeight={600}>
				{writeoff_text}
			</P>
			<Stack gap={1} my={1}>
				{props.writeoff}
			</Stack>
		</OperationModal>
		{props.children}
	</Card>
))

import { UilMinus } from '@iconscout/react-unicons'
import { Button, Divider, IconButton, Stack } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { NumberInput } from 'components/inputs/number_input'
import { app_cache } from 'domains/pdo/cache'
import { Box, Label, observer, P, PlusIcon, Row, UseIcon } from 'lib/index'
import { uiUnit, Unit } from 'models'
import type { DetailSt } from '../detail.state'
import { MaterialSelect } from '../inputs'
import { DetailSelectModal } from '../list/list'
import { DetailName } from '../name'

interface CostRowProps {
	children: React.ReactNode
	onDelete: () => void
}

const CostRow = ({ children, onDelete }: CostRowProps) => {
	const delete_btn = (
		<IconButton variant="soft" color="danger" size="sm" onClick={onDelete}>
			<UseIcon icon={UilMinus} />
		</IconButton>
	)
	return (
		<Row justifyContent={'space-between'}>
			{children}
			{delete_btn}
		</Row>
	)
}

export const MaterialCostInputs = observer(
	({ detail }: { detail: DetailSt }) => {
		const materialCost = detail.autoWriteoff.materialCost
		const material = app_cache.materials.get(materialCost?.materialId || 0)

		return (
			<Base
				label="Расход материала"
				handleAdd={() => {
					detail.autoWriteoff.insertMaterialCost()
				}}
				hideAddButton={!!materialCost}
			>
				{materialCost && (
					<CostRow
						key={materialCost.materialId}
						onDelete={() => detail.autoWriteoff.setMaterialCost(null)}
					>
						<Stack gap={0.5}>
							<Label xs>
								Автоматическое списание материала при запуске в производство
							</Label>
							<MaterialSelect
								value={materialCost}
								index={0}
								onChange={cost => {
									detail.autoWriteoff.updateMaterial(
										cost.materialId,
										cost.length!,
									)
								}}
							/>
							<Row>
								<NumberInput
									width={100}
									size="sm"
									unit={uiUnit(material?.unit)}
									value={materialCost.length}
									onChange={v => {
										materialCost.setLength(v)
									}}
								/>
								{material?.unit === Unit.M && materialCost.length && (
									<P color="neutral" level="body-xs">
										{materialCost.length * 1000} мм
									</P>
								)}
							</Row>
						</Stack>
					</CostRow>
				)}
			</Base>
		)
	},
)

export const AutomaticWriteoffAccordion = observer(
	({ detail }: { detail: DetailSt }) => (
		<AccordionCard title="Расход" defaultExpanded>
			<MaterialCostInputs detail={detail} />
			<Divider sx={{ my: 0.5 }} />
			<DetailCostInputs detail={detail} />
		</AccordionCard>
	),
)

export const DetailCostInputs = observer(({ detail }: { detail: DetailSt }) => (
	<Base
		label="Расход деталей"
		handleAdd={() => detail.autoWriteoff.insertDetail()}
	>
		<Label xs>
			Укажите детали, которые используются в заготовке данной детали, и их
			количество
		</Label>

		{detail.autoWriteoff.detailsCost.map((cost, index) => {
			const detailCache = app_cache.details.get(cost.detailId)
			if (app_cache.details.loader.loading) return <Label xs>Загрузка..7</Label>
			else if (!detailCache)
				return (
					<DetailSelectModal
						openButton={
							<Button variant="solid" size="sm">
								Выбрать
							</Button>
						}
						onRowClick={detail => {
							cost.setDetailId(detail.id)
						}}
					/>
				)
			return (
				<CostRow
					key={detailCache.id + index.toString()}
					onDelete={() => {
						detail.autoWriteoff.deleteDetail(cost.detailId)
					}}
				>
					<Row
						width={'-webkit-fill-available'}
						justifyContent={'space-between'}
					>
						<DetailName
							detail={{
								id: detailCache.id ?? 0,
								name: detailCache.name,
								group_id: detailCache.groupId ?? 0,
							}}
							withGroupName
						/>
						<NumberInput
							variant="plain"
							width={70}
							size="sm"
							value={cost.qty}
							onChange={v => {
								cost.setQty(v)
							}}
						/>
					</Row>
				</CostRow>
			)
		})}
	</Base>
))

interface BaseProps {
	label: string
	children?: React.ReactNode
	handleAdd: () => void
	hideAddButton?: boolean
}

const Base = (props: BaseProps) => (
	<Box>
		<Label color="primary">{props.label}</Label>
		<Stack gap={1}>{props.children}</Stack>
		<Box mt={1}>
			{!props.hideAddButton && (
				<PlusIcon
					onClick={() => props.handleAdd()}
					variant="outlined"
					color="neutral"
				/>
			)}
		</Box>
	</Box>
)

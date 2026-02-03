import { UilMinus } from '@iconscout/react-unicons'
import { Button, Divider, IconButton, Stack } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { NumberInput } from 'components/inputs/number_input'
import { app_cache } from 'domains/pdo/cache'
import { Box, Label, observer, PlusIcon, Row, UseIcon } from 'lib/index'
import { MaterialRequirement, uiUnit } from 'models'
import type { DetailSt, DetailStProp } from '../detail.state'
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
		<Row justifyContent={'space-between'} flexWrap={'nowrap'}>
			{children}
			{delete_btn}
		</Row>
	)
}

export const MaterialCostInputs = observer(
	({ detail }: { detail: DetailSt }) => {
		const materialCost = detail.blank.materialCost
		const material = app_cache.materials.get(materialCost?.materialId || 0)

		return (
			<Base
				label="Расход материала"
				handleAdd={() => {
					detail.blank.insertMaterialCost()
				}}
				hideAddButton={!!materialCost}
			>
				{materialCost && (
					<CostRow
						key={materialCost.materialId}
						onDelete={() => detail.blank.setMaterialCost(null)}
					>
						<Stack gap={0.5}>
							<Label xs>
								Автоматическое списание материала при запуске в производство
							</Label>
							<MaterialSelect
								value={material?.id}
								index={0}
								onChange={material_id => {
									detail.blank.updateMaterial(material_id)
								}}
							/>
							<MaterialRequirementSelector detail={detail} />
						</Stack>
					</CostRow>
				)}
			</Base>
		)
	},
)

const MaterialRequirementSelector = observer((props: DetailStProp) => {
	const { materialCost } = props.detail.blank
	switch (materialCost?.data?.type) {
		case MaterialRequirement.Single:
			return <SingleMaterialRequirement detail={props.detail} />
		case MaterialRequirement.Batch:
			return <BatchMaterialRequirement />
		case MaterialRequirement.Countable:
			return <CountableMaterialRequirement />
		default:
			throw Error('unrecognized material reuirement')
	}
})

const SingleMaterialRequirement = observer((props: DetailStProp) => {
	const { materialCost } = props.detail.blank
	const type = MaterialRequirement.Single

	if (materialCost?.data?.type != type) return

	const material = materialCost.material
	const existing = materialCost.data
	return (
		<Row>
			<NumberInput
				label="Расход"
				unit={uiUnit(material?.unit)}
				value={materialCost?.data.gross_length}
				onChange={v => {
					materialCost.set_data({
						type,
						blank_length: existing.blank_length,
						gross_length: v,
					})
				}}
			/>
			<NumberInput
				label="Длина заготовки"
				unit={uiUnit(material?.unit)}
				value={materialCost?.data.blank_length}
				onChange={v => {
					materialCost.set_data({
						type,
						gross_length: existing.gross_length,
						blank_length: v,
					})
				}}
			/>
			{/* {material?.unit === Unit.M && materialCost.length && (
			<P color="neutral" level="body-xs">
				{materialCost.length * 1000} мм
			</P>
		)} */}
		</Row>
	)
})

const BatchMaterialRequirement = observer(() => {
	return <></>
})

const CountableMaterialRequirement = observer(() => {
	return <></>
})

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
	<Base label="Расход деталей" handleAdd={() => detail.blank.insertDetail()}>
		<Label xs>
			Укажите детали, которые используются в заготовке данной детали, и их
			количество
		</Label>

		{detail.blank.detailsCost.map((cost, index) => {
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
						detail.blank.deleteDetail(cost.detailId)
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

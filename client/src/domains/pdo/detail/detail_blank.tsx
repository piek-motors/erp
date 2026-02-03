import { UilMinus } from '@iconscout/react-unicons'
import { IconButton, Stack } from '@mui/joy'
import { NumberInput } from 'components/inputs/number_input'
import { EnumSelect } from 'components/select'
import { app_cache } from 'domains/pdo/cache'
import {
	Box,
	Label,
	observer,
	PlusIcon,
	Row,
	UseIcon,
	useState,
} from 'lib/index'
import {
	MaterialRequirement,
	UiMaterialRequirement,
	uiUnit,
	Unit,
} from 'models'
import type { DetailSt, DetailStProp } from './detail.state'
import { MaterialSelect } from './inputs'
import { DetailSelectModal } from './list/list'
import { DetailName } from './name'

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

export const MaterialRequirementInput = observer(
	({ detail }: { detail: DetailSt }) => {
		const materialCost = detail.blank.materialCost
		const material = app_cache.materials.get(materialCost?.material_id || 0)

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
						key={materialCost.material_id}
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
							<MaterialRequirementTypeSelect detail={detail} />
							<MaterialRequirementSelector detail={detail} />
						</Stack>
					</CostRow>
				)}
			</Base>
		)
	},
)

const MaterialRequirementTypeSelect = observer(
	({ detail }: { detail: DetailSt }) => (
		<EnumSelect
			label="Тип заготовки"
			enum={MaterialRequirement}
			value={detail.blank.materialCost?.data.type}
			labels={UiMaterialRequirement}
			onChange={type => {
				detail.blank.materialCost?.set_data({
					type,
				})
			}}
		/>
	),
)

const MaterialRequirementSelector = observer((props: DetailStProp) => {
	const { materialCost } = props.detail.blank
	const type = materialCost?.data?.type
	if (type == null) return

	switch (+type) {
		case MaterialRequirement.Single:
			return <SingleMaterialRequirement detail={props.detail} />
		case MaterialRequirement.Batch:
			return <BatchMaterialRequirement detail={props.detail} />
		case MaterialRequirement.Countable:
			return <CountableMaterialRequirement detail={props.detail} />
		default:
			throw Error('unrecognized material reuirement')
	}
})

const SingleMaterialRequirement = observer((props: DetailStProp) => {
	const type = MaterialRequirement.Single
	const { materialCost } = props.detail.blank
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

const BatchMaterialRequirement = observer((props: DetailStProp) => {
	const type = MaterialRequirement.Batch
	const { materialCost } = props.detail.blank
	if (materialCost?.data?.type != type) return
	const material = materialCost.material
	const existing = materialCost.data

	return (
		<Row>
			<NumberInput
				label="Длина прутка"
				unit={uiUnit(material?.unit)}
				value={materialCost?.data.stock_length}
				onChange={v => {
					materialCost.set_data({
						type,
						stock_length: v,
						yield_per_stock: existing.yield_per_stock,
					})
				}}
			/>
			<NumberInput
				label="Выход с прутка"
				unit={uiUnit(Unit.Countable)}
				value={materialCost?.data.yield_per_stock}
				onChange={v => {
					materialCost.set_data({
						type,
						stock_length: existing.stock_length,
						yield_per_stock: v,
					})
				}}
			/>
		</Row>
	)
})

const CountableMaterialRequirement = observer((props: DetailStProp) => {
	const type = MaterialRequirement.Countable
	const { materialCost } = props.detail.blank
	if (materialCost?.data?.type != type) return

	return (
		<NumberInput
			label="Кол-во"
			unit={uiUnit(Unit.Countable)}
			value={materialCost.data.count}
			onChange={count => {
				materialCost.set_data({
					type,
					count,
				})
			}}
		/>
	)
})

export const DetailRequirementInput = observer(
	({ detail }: { detail: DetailSt }) => {
		const [open, setOpen] = useState(false)
		const handle_add = () => {
			detail.blank.insertDetail()
			setOpen(true)
		}
		return (
			<Base label="Расход деталей" handleAdd={handle_add}>
				<Label xs>
					Укажите детали, которые используются в заготовке данной детали, и их
					количество
				</Label>
				{detail.blank.detailsCost.map((cost, index) => {
					const detail = app_cache.details.get(cost.detailId)
					if (app_cache.details.loader.loading)
						return <Label xs>Загрузка..7</Label>
					else if (!detail)
						return (
							<DetailSelectModal
								open={open}
								setOpen={setOpen}
								onRowClick={detail => {
									cost.setDetailId(detail.id)
								}}
							/>
						)
					return (
						<CostRow
							key={detail.id + index.toString()}
							onDelete={() => {
								detail.blank.deleteDetail(cost.detailId)
							}}
						>
							<Row
								width={'-webkit-fill-available'}
								justifyContent={'space-between'}
							>
								<DetailName detail={detail} withGroupName />
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
		)
	},
)

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

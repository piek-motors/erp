import { Box, Card, Chip, type ChipProps, Divider } from '@mui/joy'
import { AttachmentComponent } from 'components/attachments/attachment'
import { NumberInput } from 'components/inputs/number_input'
import { InModal } from 'components/modal'
import { PrintOnly, WebOnly } from 'components/utilities/conditional-display'
import { DetailName } from 'domains/pdo/detail/name'
import { rpc } from 'lib/deps'
import {
	Button,
	DeleteResourceButton,
	Label,
	Loading,
	observer,
	openPage,
	P,
	routeMap,
	Row,
	SaveIconButton,
	Stack,
	useEffect,
	useNavigate,
	useParams,
	useState,
} from 'lib/index'
import { notifier } from 'lib/store/notifier.store'
import { fmtDate, timeDeltaDays } from 'lib/utils/date_fmt'
import { roundAndTrim } from 'lib/utils/fmt'
import {
	ManufacturingOrderStatus as OrderStatus,
	uiManufacturingOrderStatus,
	uiUnit,
} from 'models'
import { app_cache } from '../cache'
import type { BlankSpec, DetailSt, DetailStProp } from '../detail/detail.state'
import { TechParamsDisplay } from '../detail/inputs'
import type { MaterialCost } from '../detail/warehouse/cost.store'
import { MaterialName } from '../material/name'
import { MetalPageTitle } from '../shared/basic'
import { api } from './api'
import { OrderSt, type OrderStProp } from './order.state'
import { TechPassportTable } from './tech_passport/passport_table'
import { ProductionRoute } from './tech_passport/production_route_table'
import { DetailDescription } from './tech_passport/shared'

const deletionAllowed = [
	OrderStatus.Waiting,
	OrderStatus.Preparation,
	OrderStatus.Production,
]

export const ManufacturingUpdatePage = observer(() => {
	const { id } = useParams<{ id: string }>()

	const [detail, setDetail] = useState<DetailSt | null>(null)
	const [order] = useState(() => new OrderSt())

	useEffect(() => {
		if (id) {
			api.load(Number(id)).then(res => {
				setDetail(res.detail)
				order.setOrder(res.order)
			})
		}
	}, [id])

	if (!detail || api.loader.loading || order.isLoading()) {
		return <Loading />
	}

	if (!order.resp) {
		return <div>Заказ не найден</div>
	}

	const isDeletionAllowed = deletionAllowed.includes(order.status)

	return (
		<Stack p={1} gap={1}>
			<WebOnly>
				<Card size="sm">
					<Stack gap={1}>
						<MetalPageTitle
							t={
								<Box width={'max-content'}>
									<Row>
										<P level="body-sm" whiteSpace={'nowrap'}>
											Заказ №{order.id}
										</P>
										<OrderStatusChip status={order.resp.status} />
									</Row>
									<DetailName
										detail={{
											id: detail.id,
											name: detail.name,
											group_id: detail.groupId || null,
										}}
										withGroupName
									/>
								</Box>
							}
						/>
						<Divider />
						<Row gap={1} alignItems={'start'}>
							<ProductionSteps order={order} detail={detail} />
							<Divider orientation="vertical" />
							<Stack gap={1}>
								<TechPassportButton order={order} />
								<QuantityInput
									order={order}
									recBatchSize={detail.recommendedBatchSize}
								/>
							</Stack>
							<Cost order={order} detail={detail} />
						</Row>
						<Divider />
						<Row gap={2} alignItems={'start'} flexWrap={'wrap'}>
							<BlankSpecDisplay blankSpec={detail?.blankSpec} />
							<DetailAttachments detail={detail} />
							<DetailDescription htmlContent={detail.description} />
						</Row>
						<Dates order={order} />
						<Row
							justifyContent={
								[OrderStatus.Production, OrderStatus.Collected].includes(
									order.status,
								)
									? 'end'
									: 'start'
							}
						>
							{api.loader.loading && <Loading />}
							<ActionButton order={order} />
							{isDeletionAllowed && <DeleteOrderButton order={order} />}
						</Row>
					</Stack>
				</Card>
				<DuplicationCheckModal order={order} />
			</WebOnly>

			<PrintOnly display="block">
				<PrintingPageVerion order={order} detail={detail} />
			</PrintOnly>
		</Stack>
	)
})

const OrderStatusChip = ({ status }: { status: OrderStatus }) => {
	let color: ChipProps['color'] = 'neutral'
	switch (status) {
		case OrderStatus.Production:
			color = 'primary'
			break
		case OrderStatus.Collected:
			color = 'success'
			break
	}
	return (
		<Chip color={color} variant="solid" size="sm">
			{uiManufacturingOrderStatus(status)}
		</Chip>
	)
}

const ProductionSteps = observer(
	({ detail, order }: DetailStProp & OrderStProp) => {
		if (
			detail.processingRoute.steps.length === 0 ||
			order.status == OrderStatus.Collected
		)
			return null
		return (
			<Stack>
				<Label label="Этапы обработки" />
				{detail.processingRoute.steps.map((operation, operation_index) => {
					const current = order.currentOperation === operation_index
					const timedelta =
						current &&
						order.resp?.current_operation_start_at &&
						timeDeltaDays(order.resp.current_operation_start_at)
					return (
						<Row>
							<Button
								size="sm"
								key={operation.name}
								variant={current ? 'solid' : 'plain'}
								sx={{ width: 'fit-content', textAlign: 'left' }}
								color={current ? 'success' : 'neutral'}
								onClick={() => api.setCurrentOperation(order, operation_index)}
							>
								{operation.name}
							</Button>
							<Label>{timedelta}</Label>
						</Row>
					)
				})}
			</Stack>
		)
	},
)

const BlankSpecDisplay = observer(
	({ blankSpec }: { blankSpec?: BlankSpec | null }) => {
		if (blankSpec == null || blankSpec.arr.length === 0) return null
		return (
			<Stack display={'flex'} alignSelf={'start'}>
				<Label label="Заготовка" />
				<TechParamsDisplay params={blankSpec} level="body-xs" />
			</Stack>
		)
	},
)

const DetailAttachments = observer(({ detail }: { detail: DetailSt }) => {
	if (detail.attachments.files.length === 0) return null
	return (
		<Stack>
			<Label label="Файлы" />
			{detail.attachments.files.map(file => (
				<AttachmentComponent
					key={file.key}
					attachment={file}
					editable={false}
				/>
			))}
		</Stack>
	)
})

const Dates = observer(({ order }: { order: OrderSt }) => {
	if (!order.resp) return null
	const createdAt = fmtDate(new Date(order.resp.created_at))
	const startedAt = order.resp.started_at
		? fmtDate(new Date(order.resp.started_at), true)
		: null
	const finishedAt = order.resp.finished_at
		? fmtDate(new Date(order.resp.finished_at), true)
		: null
	return (
		<Row gap={1}>
			<>
				<Label xs label="Создан" />
				<P level="body-xs">{createdAt}</P>
			</>

			{startedAt && (
				<>
					<Label xs label="Старт" />
					<P level="body-xs">{startedAt}</P>
				</>
			)}

			{finishedAt && (
				<>
					<Label xs label="Завершен" />
					<P level="body-xs">{finishedAt}</P>
				</>
			)}
		</Row>
	)
})

const TechPassportButton = ({ order }: OrderStProp) => {
	if (
		![OrderStatus.Preparation, OrderStatus.Production].includes(order.status)
	) {
		return null
	}
	return (
		<Button
			onClick={() => window.print()}
			color="primary"
			variant="soft"
			sx={{ width: 'fit-content' }}
		>
			Тех. паспорт
		</Button>
	)
}

const PrintingPageVerion = (props: DetailStProp & OrderStProp) => (
	<>
		<TechPassportTable {...props} />
		<ProductionRoute {...props} />
	</>
)

const DeleteOrderButton = observer(({ order }: OrderStProp) => {
	const navigate = useNavigate()
	const msg = `Удалить заказ?\nEсли заказ находится в состоянии "Производство" - значит материал уже был списан. 
            В этом случае необходимо вручную скорректировать остатки через поставку.`
	return (
		<DeleteResourceButton
			onClick={e => {
				e.stopPropagation()
				if (window.confirm(msg)) {
					api.delete(order!.id).then(() => {
						navigate(routeMap.pdo.index)
					})
				}
			}}
		/>
	)
})

const Cost = observer(({ detail, order }: DetailStProp & OrderStProp) => {
	if (order?.status === OrderStatus.Collected) {
		return null
	}
	const materialCost = detail.autoWriteoff.materialCost
	const details = detail.autoWriteoff.detailsCost
	return (
		<Row alignItems={'start'}>
			{materialCost ? (
				<Card size="sm">
					<Label label="Материал к потреблению" />
					<Stack gap={0.5}>
						<MaterialCostCalculations cost={materialCost} order={order} />
					</Stack>
				</Card>
			) : null}
			{details.length ? (
				<Card size="sm">
					<Label label="Детали к потреблению" />
					<Stack gap={0.5}>
						{details.map((cost, index) => (
							<Row justifyContent={'space-between'}>
								<DetailName
									detail={{
										id: cost.detailId,
										name: cost.detail?.name || '',
										group_id: cost.detail?.groupId || null,
									}}
								/>
								<P>
									{cost.qty} <Label xs>шт</Label>
								</P>
							</Row>
						))}
					</Stack>
				</Card>
			) : null}
		</Row>
	)
})

const QuantityInput = observer(
	({ recBatchSize, order }: OrderStProp & { recBatchSize?: number }) => {
		const isProduction = order.status === OrderStatus.Production
		const isCollected = order.status === OrderStatus.Collected

		const mode = isProduction
			? {
					label: 'Выпуск',
					initialQty: order.outputQty,
					save: (qty: number) => order.setOutputQty(qty),
					notification: 'Выпуск установлен',
				}
			: {
					label: 'Кол-во',
					initialQty: order.qty,
					save: (qty: number) => order.setQty(qty),
					notification: 'Кол-во установлено',
				}

		const [qty, setQty] = useState<number | undefined>(mode.initialQty)

		const isUnchanged = qty === mode.initialQty

		const handleSave = async () => {
			if (qty == null) return
			await rpc.pdo.orders_mut.update_qty.mutate({
				id: order.id,
				qty,
			})
			mode.save(qty)
			notifier.ok(mode.notification)
		}

		if (isCollected) {
			return (
				<Row gap={1}>
					<Label label="Кол-во" />
					<P>{order.outputQty ?? order.qty}</P>
				</Row>
			)
		}

		return (
			<Card size="sm" variant="soft" color="success">
				<Stack>
					{recBatchSize && (
						<P level="body-xs" color="primary">
							Реком. размер партии — {recBatchSize} шт
						</P>
					)}

					{isProduction && (
						<P level="body-xs" color="neutral">
							Заказано — {order.qty} шт
						</P>
					)}

					<Row alignItems="end">
						<NumberInput
							label={mode.label}
							size="sm"
							sx={{ maxWidth: 80 }}
							value={qty}
							variant="outlined"
							onChange={setQty}
						/>

						<SaveIconButton
							size="sm"
							variant="soft"
							disabled={qty == null || isUnchanged}
							onClick={handleSave}
						/>
					</Row>
				</Stack>
			</Card>
		)
	},
)

const ActionButton = observer(({ order }: OrderStProp) => {
	switch (order.status as OrderStatus) {
		case OrderStatus.Waiting:
			return (
				<Button
					size="sm"
					color="success"
					onClick={() => api.startPreparation(order)}
					disabled={api.loader.loading}
				>
					Начать подготовку материалов
				</Button>
			)
		case OrderStatus.Preparation:
			return (
				<Button
					size="sm"
					color="primary"
					onClick={() => api.startProduction(order)}
					disabled={api.loader.loading || !order.qty}
				>
					Начать производство
				</Button>
			)
		case OrderStatus.Production:
			return (
				<Button
					onClick={() => api.finish(order)}
					disabled={api.loader.loading}
					size="sm"
					color="primary"
				>
					В архив
				</Button>
			)
		case OrderStatus.Collected:
			return (
				<Button
					onClick={() => api.returnToProduction(order)}
					disabled={api.loader.loading}
					size="sm"
					color="danger"
					variant="outlined"
				>
					Вернуть в производство
				</Button>
			)
		default:
			return null
	}
})

const DuplicationCheckModal = observer(({ order }: { order: OrderSt }) => {
	const navigate = useNavigate()
	if (!order.orderAlreadyInProductionModal) return null
	const detail = app_cache.details.get(
		order.orderAlreadyInProductionModal.detailId,
	)
	if (!detail) return null
	const modalState = order.orderAlreadyInProductionModal
	return (
		<InModal
			size="lg"
			open={Boolean(order.orderAlreadyInProductionModal)}
			setOpen={() => order.setOrderAlreadyInProductionModal(null)}
			onClose={() => order.setOrderAlreadyInProductionModal(null)}
		>
			<P>
				Заказ на производство{' '}
				<b>
					{detail.name} - {modalState.qty} шт
				</b>{' '}
				уже в производстве под номером <b>{modalState.manufacturingId}</b>
			</P>
			<Row mt={3}>
				<Button
					size="sm"
					variant="soft"
					onClick={async () => {
						navigate(
							openPage(routeMap.pdo.order.edit, modalState.manufacturingId),
						)
						order.setOrderAlreadyInProductionModal(null)
						await api.delete(order.id)
					}}
				>
					Открыть существующий и удалить текущий
				</Button>
				<Button
					size="sm"
					variant="soft"
					onClick={async () => {
						order.setOrderAlreadyInProductionModal(null)
						await api.startProduction(order, true)
					}}
					disabled={api.loader.loading}
				>
					Запустить новый
				</Button>
			</Row>
		</InModal>
	)
})

const MaterialCostCalculations = observer(
	(props: { cost: MaterialCost; order: OrderSt }) => {
		const { cost, order } = props

		const costCalculations = () => {
			if (!order.qty) return null
			const totalConsumedAmount = order.qty * (cost.length || 0)
			const remainingAmount = (cost.material?.stock || 0) - totalConsumedAmount
			const unit = uiUnit(cost?.material?.unit)
			return (
				<>
					<Divider sx={{ my: 0.5 }} />
					<P level="body-sm" color="neutral">
						Потребное кол-во: {roundAndTrim(totalConsumedAmount, 3) || 0} {unit}
					</P>

					<P level="body-sm" color="neutral">
						Остаток: {roundAndTrim(cost.material?.stock, 3) || 0} {unit}
					</P>

					{order?.status === OrderStatus.Preparation && (
						<P
							color={
								remainingAmount >= 0
									? 'success'
									: remainingAmount < 0
										? 'danger'
										: 'primary'
							}
							level="body-sm"
						>
							Остаток после запуска {remainingAmount.toFixed(1)} {unit}
						</P>
					)}
				</>
			)
		}

		return (
			<Box>
				<Row>
					<MaterialName
						materialId={cost.materialId}
						materialLabel={cost.material?.label || ''}
					/>
					<Label level="body-sm" color="primary">
						Расход {cost?.length || 'не указано'}{' '}
						{uiUnit(cost.material?.unit) || ''}
					</Label>
				</Row>
				{costCalculations()}
			</Box>
		)
	},
)

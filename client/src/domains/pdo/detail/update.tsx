import { Box, Stack } from '@mui/joy'
import { MetalPageTitle, SaveAndDelete } from 'domains/pdo/shared/basic'
import {
	Loading,
	observer,
	openPage,
	P,
	routeMap,
	Row,
	useEffect,
	useNavigate,
	useParams,
	useState,
} from 'lib/index'
import { fmtDate, fmtTimestamp } from 'lib/utils/date_fmt'
import { CreateManufacturingOrder } from '../orders/create_order'
import { api } from './api'
import type { DetailSt, DetailStProp } from './detail.state'
import { DetailInputs } from './inputs'
import { DetailWarehouseModal } from './warehouse/ui'

export const UpdateDetailPage = observer(() => {
	const { id } = useParams<{ id: string }>()
	if (!id) {
		throw new Error('Invalid page params; id is required')
	}
	const [detail, setDetail] = useState<DetailSt | null>(null)

	useEffect(() => {
		api.get(Number(id)).then(d => {
			setDetail(d)
		})
	}, [id])

	if (api.loader.loading || !detail) return <Loading />
	return (
		<Stack gap={0.5} sx={{ flex: 1, p: 1 }}>
			<MetalPageTitle
				t={
					Boolean(detail.id) && (
						<P level="body-sm" whiteSpace={'nowrap'}>
							Деталь № {detail.id}
						</P>
					)
				}
			/>
			<Row flexWrap={'wrap'} gap={1}>
				<DetailWarehouseModal detail={detail} />
				<CreateManufacturingOrder detailId={detail.id} />
			</Row>
			<DetailInputs
				detail={detail}
				leftChildren={
					<Box pt={1}>
						<Metadata
							updatedAt={detail.updatedAt}
							lastManufacturingDate={detail.lastManufacturingDate}
							lastManufacturingQty={detail.lastManufacturingQty}
						/>
						<SaveFloatingButton detail={detail} />
					</Box>
				}
			/>
		</Stack>
	)
})

const SaveFloatingButton = ({ detail }: DetailStProp) => {
	const navigate = useNavigate()
	return (
		<SaveAndDelete
			itemName={`Деталь (${detail.id}) - ${detail.name}`}
			handleDelete={() =>
				api.delete(detail.id).then(() => {
					navigate(openPage(routeMap.pdo.details))
				})
			}
			handleSave={() => api.update(detail)}
		/>
	)
}

function Metadata(props: {
	updatedAt?: Date
	lastManufacturingDate?: Date
	lastManufacturingQty?: number
}) {
	return (
		<Stack gap={0.5}>
			{props.lastManufacturingDate && (
				<P level="body-xs" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
					<b>Последнее производство:</b>{' '}
					{fmtTimestamp(props.lastManufacturingDate)}
					{props.lastManufacturingQty && (
						<span> ({props.lastManufacturingQty} шт)</span>
					)}
				</P>
			)}
			{props.updatedAt && (
				<P level="body-xs" color="neutral" sx={{ whiteSpace: 'nowrap' }}>
					<b>Обновлено:</b> {fmtDate(props.updatedAt)}
				</P>
			)}
		</Stack>
	)
}

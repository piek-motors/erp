import {
	ActionButton,
	observer,
	openPage,
	routeMap,
	useNavigate,
} from 'lib/index'
import { api } from '../detail/detail_api'

export const CreateManufacturingOrder = observer(
	({ detailId }: { detailId: number }) => {
		const navigate = useNavigate()

		const handleSubmit = async () =>
			api
				.create_production_order(detailId)
				.then(r => {
					navigate(openPage(routeMap.pdo.order.edit, r.id))
				})
				.catch(e => {
					if (
						e.data?.code === 'BAD_REQUEST' &&
						e.message.includes('already exists')
					) {
						const existing_order_id = parseInt(e.message.split('order_id=')[1])
						if (existing_order_id) {
							navigate(openPage(routeMap.pdo.order.edit, existing_order_id))
						}
					}
				})

		return (
			<ActionButton
				label="В производство"
				onClick={handleSubmit}
				props={{
					variant: 'solid',
					color: 'success',
				}}
			/>
		)
	},
)

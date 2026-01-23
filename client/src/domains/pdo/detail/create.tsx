import { MetalPageTitle } from 'domains/pdo/shared/basic'
import {
	ActionButton,
	observer,
	Stack,
	TakeLookHint,
	useState,
} from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { api } from './api'
import { DetailSt } from './detail.state'
import { DetailInputs } from './inputs'

export const CreateDetailPage = observer(() => {
	const [detail, setDetail] = useState(() => new DetailSt())
	const [insertedDetailId, setInsertedDetailId] = useState<number | null>(null)
	return (
		<Stack gap={2} p={1}>
			<MetalPageTitle t={'Добавить деталь'} />
			{insertedDetailId && (
				<TakeLookHint
					text="Перейти к добавленной детали"
					link={openPage(routeMap.pdo.detail.edit, insertedDetailId)}
				/>
			)}
			<DetailInputs detail={detail} />
			<ActionButton
				onClick={() =>
					api.insert(detail).then(id => {
						setInsertedDetailId(id)
						setDetail(new DetailSt())
					})
				}
			/>
		</Stack>
	)
})

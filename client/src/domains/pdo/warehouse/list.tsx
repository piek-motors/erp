import { ScrollableWindow } from 'components/scrollable_window'
import { Table } from 'components/table.impl'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import { Label } from 'lib/index'
import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { rpc } from 'lib/rpc/rpc.client'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OperationType } from 'models'
import { useEffect, useState } from 'react'
import type { OperationListItem } from 'srv/rpc/pdo/operations'
import { columns } from './columns'

export type Operation = OperationListItem

class OperationsStore {
	readonly loader = new LoadingController()
	operations: Operation[] = []
	constructor() {
		makeAutoObservable(this)
	}
	setOperations(operations: Operation[]) {
		this.operations = operations
	}
	async load(materialId?: number, detailId?: number) {
		this.setOperations([])
		this.loader.run(async () => {
			const operationsRaw = await rpc.pdo.operations.list.query({
				materialId,
				detailId,
			})
			const operations = matrixDecoder<Operation>(operationsRaw)
			this.setOperations(operations)
		})
	}

	get no_data() {
		return !this.loader.loading && this.operations.length == 0
	}
}

interface Props {
	materialId?: number
	detailId?: number
}

export const OperationsTitle = () => <MetalPageTitle t={'Журнал остатков'} />

export const OperationsTable = observer((props: Props) => {
	const { materialId, detailId } = props
	const [store] = useState(() => new OperationsStore())

	useEffect(() => {
		store.load(materialId, detailId)
	}, [materialId, detailId])

	return (
		<ScrollableWindow
			scroll={
				<>
					{store.no_data && <Label px={1}>Нет информации</Label>}
					<Table
						sx={{ cursor: 'initial' }}
						columns={columns}
						data={store.operations}
						rowStyleCb={op => {
							const type = Number(op.original.operation_type)
							if (type === OperationType.Supply) {
								return {
									backgroundColor: '#c6e7c3b9',
								}
							}
							return {}
						}}
					/>
				</>
			}
		/>
	)
})

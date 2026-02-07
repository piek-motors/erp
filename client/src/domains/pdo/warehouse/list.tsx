import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OperationType } from 'models'
import { useEffect } from 'react'
import { ScrollableWindow } from '@/components/scrollable_window'
import { Table } from '@/components/table.impl'
import { MetalPageTitle } from '@/domains/pdo/shared/basic'
import { Label } from '@/lib/index'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import type { OperationListItem } from '@/server/domains/pdo/operations_rpc'
import { MobileNavModal, MobilePadding } from '../root_layout'
import { columns } from './columns'

export type Operation = OperationListItem

class OperationsSt {
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

  async revert(operation_id: number) {
    await rpc.pdo.operations.revert.mutate({ id: operation_id })
    await this.load()
  }

  get no_data() {
    return !this.loader.loading && this.operations.length == 0
  }
}

export const operations_st = new OperationsSt()

interface Props {
  materialId?: number
  detailId?: number
}

export const OperationsTitle = () => <MetalPageTitle t={'Журнал остатков'} />

export const OperationsTable = observer((props: Props) => {
  const { materialId, detailId } = props
  const store = operations_st

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

export const OperationsPage = () => (
  <>
    <MobilePadding>
      <MobileNavModal t={'Журнал'} />
    </MobilePadding>
    <OperationsTable />
  </>
)

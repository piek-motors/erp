import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OperationSubject, OperationType, uiUnit } from 'models'
import { useEffect } from 'react'
import { ScrollableWindow } from '@/components/scrollable_window'
import { Table } from '@/components/table.impl'
import { MetalPageTitle } from '@/domains/pdo/shared/basic'
import { Button, Label, Loading, ToggleButtonGroup } from '@/lib/index'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import { notifier } from '@/lib/store/notifier.store'
import type { OperationListItem } from '@/server/domains/pdo/operations_rpc'
import { app_cache } from '../cache'
import { MobileNavModal, MobilePadding } from '../root_layout'
import { detail_columns, material_columns } from './columns'

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

  subject = OperationSubject.Material
  setSubject(v: OperationSubject) {
    this.subject = v
    this.load()
  }

  async load(materialId?: number, detailId?: number) {
    this.loader.run(async () => {
      const operationsRaw = await rpc.pdo.operations.list.query({
        materialId,
        detailId,
        subject: this.subject,
      })
      const operations = matrixDecoder<Operation>(operationsRaw)
      this.setOperations(operations)
    })
  }

  async revert(operation: Operation) {
    let object_title: string | undefined
    if (operation.material_id) {
      object_title = app_cache.materials.get(operation.material_id)?.label
    }
    if (operation.detail_id) {
      object_title = app_cache.details.get(operation.detail_id)?.name
    }

    const msg = `Откатить операцию для ${object_title} на ${operation.qty} ${uiUnit(operation.unit)}?`

    if (window.confirm(msg)) {
      const res = await rpc.pdo.operations.revert.mutate({ id: operation.id })
      notifier.warn(res.message)
      await this.load()
    }
  }

  get no_data() {
    return !this.loader.loading && this.operations.length === 0
  }

  get columns() {
    return this.subject === OperationSubject.Material
      ? material_columns
      : detail_columns
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
          <ToggleButtonGroup
            sx={{ p: 1 }}
            size="sm"
            variant="soft"
            color="primary"
            value={store.subject.toString()}
            onChange={(_, v) => {
              if (v != null) store.setSubject(Number(v))
            }}
          >
            <Button value={OperationSubject.Material.toString()}>
              Материалы
            </Button>
            <Button value={OperationSubject.Detail.toString()}>Детали</Button>
          </ToggleButtonGroup>

          {store.loader.loading && <Loading />}
          <Table
            sx={{ cursor: 'initial' }}
            columns={store.columns}
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

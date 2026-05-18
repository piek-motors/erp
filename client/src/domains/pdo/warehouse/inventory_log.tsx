import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { OperationSubject, OperationType } from 'shared'
import { ScrollableWindow } from '@/components/scrollable_window'
import { Table } from '@/components/table.impl'
import { MetalPageTitle } from '@/domains/pdo/shared/basic'
import { Button, Label, Loading, ToggleButtonGroup } from '@/lib/index'
import type { OperationListItem } from '@/server/domains/pdo/operations_rpc'
import { MobileNavModal, MobilePadding } from '../root_layout'
import { inventory_log_vm } from './inventory_log_vm'

export type InventoryLogRecord = OperationListItem
export const InventoryLogTitle = () => <MetalPageTitle t={'Журнал остатков'} />

interface Props {
  materialId?: number
  detailId?: number
}

export const InventoryLog = observer((props: Props) => {
  const { materialId, detailId } = props
  const store = inventory_log_vm

  useEffect(() => {
    store.load(materialId, detailId)
  }, [materialId, detailId])

  return (
    <ScrollableWindow
      scroll={
        <>
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
          {store.no_data && <Label px={1}>Нет информации</Label>}

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

export const InventoryLogPage = () => (
  <>
    <MobilePadding>
      <MobileNavModal t={'Журнал'} />
    </MobilePadding>
    <InventoryLog />
  </>
)

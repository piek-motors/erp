import { ScrollableWindow } from 'components/scrollable_window'
import { Table } from 'components/table.impl'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import { observer } from 'mobx-react-lite'
import { OperationType } from 'models'
import { useEffect } from 'react'
import { MobileNavModal } from '../root_layout'
import { columns } from './columns'
import { s } from './store'

interface Props {
  materialId?: number
  detailId?: number
}

export const OperationsTitle = () => <MetalPageTitle t={'Журнал остатков'} />

export const OperationsTable = observer((props: Props) => {
  const { materialId, detailId } = props
  useEffect(() => {
    s.load(materialId, detailId)
  }, [materialId, detailId])
  return (
    <ScrollableWindow
      static={<MobileNavModal t="Журнал операций" />}
      scrollable={
        <Table
          sx={{ cursor: 'initial' }}
          columns={columns}
          data={s.operations}
          rowStyleCb={op => {
            const type = Number(op.original.operation_type)
            if (type === OperationType.Supply) {
              return {
                backgroundColor: '#c6e7c3b9'
              }
            }
            return {}
          }}
        />
      }
    />
  )
})

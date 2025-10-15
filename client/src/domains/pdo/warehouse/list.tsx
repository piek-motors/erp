import { ScrollableWindow } from 'components/inputs/scrollable_window'
import { Table } from 'components/table.impl'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import { observer } from 'mobx-react-lite'
import { EnOperationType } from 'models'
import { useEffect } from 'react'
import { columns } from './columns'
import { s } from './store'

interface Props {
  materialId?: number
  detailId?: number
}

export const OperationsList = observer((props: Props) => {
  const { materialId, detailId } = props
  useEffect(() => {
    s.load(materialId, detailId)
  }, [materialId, detailId])
  return (
    <ScrollableWindow
      refreshTrigger={false}
      staticContent={<MetalPageTitle t={'Журнал операций'} />}
      scrollableContent={
        <Table
          sx={{ cursor: 'initial' }}
          columns={columns}
          data={s.operations}
          rowStyleCb={op => {
            const type = Number(op.original.operation_type)
            if (type === EnOperationType.Supply) {
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

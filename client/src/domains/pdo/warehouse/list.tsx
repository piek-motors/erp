/** @jsxImportSource @emotion/react */
import { ScrollableWindow } from 'components/inputs/scrollable_window'
import { Table } from 'components/table.impl'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import { Box } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { EnOperationType } from 'models'
import { useEffect } from 'react'
import { columns } from './columns'
import { store } from './store'

interface Props {
  materialId?: number
  detailId?: number
}

export const OperationsList = observer((props: Props) => {
  const { materialId, detailId } = props
  useEffect(() => {
    store.load(materialId, detailId)
  }, [materialId, detailId])

  return (
    <ScrollableWindow
      refreshTrigger={false}
      staticContent={<MetalPageTitle t={'Журнал операций'} />}
      scrollableContent={
        <Box>
          <Table
            columns={columns}
            data={store.operations}
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
        </Box>
      }
    />
  )
})

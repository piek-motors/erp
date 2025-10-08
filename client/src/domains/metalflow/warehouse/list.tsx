/** @jsxImportSource @emotion/react */
import { ScrollableWindow } from 'components/inputs/scrollable_window'
import { Table } from 'components/table.impl'
import { DetailName } from 'domains/metalflow/detail/name'
import { MetalPageTitle } from 'domains/metalflow/shared/basic'
import { Box, Label, P } from 'lib/index'
import { formatOnlyDate } from 'lib/utils/formatting'
import { observer } from 'mobx-react-lite'
import {
  EnOperationType,
  EnSupplyReason,
  EnWriteoffReason,
  uiSupplyReason,
  uiWriteoffReason
} from 'models'
import { useEffect, useMemo, useState } from 'react'
import { Column } from 'react-table'
import { OperationName } from './operation_name'
import { Operation, store } from './store'

function getColumns(props: {
  key: number
  setKey: (n: number) => void
}): Column<Operation>[] {
  return [
    {
      Header: '№',
      accessor: 'id'
    },

    {
      Header: 'Дата',
      accessor: data => {
        return formatOnlyDate(data.timestamp!)
      }
    },
    {
      Header: `Объект`,
      id: 'name',
      accessor: data => <OperationName operation={data} showLinkButton={true} />
    },
    {
      Header: 'Кол-во',
      accessor: data => <P>{data.qty}</P>
    },
    {
      Header: 'Деталь/Заказ',
      accessor: data => {
        if (!data.detail_id) return null
        return (
          <>
            {data.manufacturing_order_id && (
              <Label>
                Заказ {data.manufacturing_order_id}
                {' ⇥ '}
                {data.manufacturing_order_qty} шт.
              </Label>
            )}
            <DetailName
              detail={{
                id: data.detail_id,
                name: data.detail_name!,
                group_id: data.logical_group_id!
              }}
              withLink
              withGroupLink
              withParamsButton
            />
          </>
        )
      }
    },
    {
      Header: 'Тип операции',
      accessor: data => {
        const isSupply = Number(data.operation_type) === EnOperationType.Supply
        return isSupply
          ? uiSupplyReason(data?.reason as EnSupplyReason)
          : uiWriteoffReason(data?.reason as EnWriteoffReason)
      }
    }
  ]
}

interface Props {
  materialId?: number
  detailId?: number
}

export const OperationsList = observer((props: Props) => {
  const { materialId, detailId } = props
  const [key, setKey] = useState(0)
  const columns = useMemo(() => getColumns({ key, setKey }), [key, setKey])

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
            trStyleCallback={op => {
              const type = Number(op.original.operation_type)
              if (type === EnOperationType.Writeoff) {
                return {
                  backgroundColor: '#f8d6d6b4'
                }
              } else if (type === EnOperationType.Supply) {
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

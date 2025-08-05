/** @jsxImportSource @emotion/react */
import { ScrollableWindow } from 'components/inputs/scrollable_window'
import { Table } from 'components/table.impl'
import {
  EnOperationType,
  EnSupplyReason,
  EnWriteoffReason,
  uiSupplyReason,
  uiWriteoffReason
} from 'domain-model'
import { DetailName } from 'domains/metalflow/details/name'
import { MetalPageTitle } from 'domains/metalflow/shared/basic'
import { Box, DeleteResourceButton, P } from 'lib/index'
import { formatDateWithTime } from 'lib/utils/formatting'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { Column } from 'react-table'
import { OperationName } from './shared/operation_name'
import { Operation, store } from './store'

function getColumns(props: {
  key: number
  setKey: (n: number) => void
}): Column<Operation>[] {
  return [
    {
      Header: 'ID',
      accessor: 'operation_id'
    },

    {
      Header: 'Дата',
      accessor: data => {
        return formatDateWithTime(data.timestamp!)
      }
    },
    {
      Header: `Объект`,
      id: 'name',
      accessor: data => <OperationName operation={data} showLinkButton={true} />
    },
    {
      Header: 'Кол-во',
      accessor: data => (
        <P>
          {data.qty} {data.label ? 'м' : 'шт'}
        </P>
      )
    },
    {
      Header: 'Деталь',
      accessor: data => {
        if (!data.detail_id) return null
        return (
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
        )
      }
    },
    {
      Header: 'Причина',
      accessor: data => {
        const isSupply = Number(data.operation_type) === EnOperationType.Supply
        return isSupply
          ? uiSupplyReason(data?.reason as EnSupplyReason)
          : uiWriteoffReason(data?.reason as EnWriteoffReason)
      }
    },
    {
      Header: 'Действие',
      accessor: data => (
        <DeleteResourceButton
          variant="plain"
          small
          onClick={() => {
            store.revertOperation(data.id!)
          }}
        />
      )
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
      staticContent={
        <Box p={1}>
          <MetalPageTitle t={'Журнал операций'} />
        </Box>
      }
      scrollableContent={
        <Box px={1}>
          <Table
            columns={columns}
            data={store.operations}
            trStyleCallback={op => {
              if (
                Number(op.original.operation_type) === EnOperationType.Supply
              ) {
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

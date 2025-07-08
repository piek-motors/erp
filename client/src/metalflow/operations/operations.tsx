/** @jsxImportSource @emotion/react */
import { Box } from '@mui/joy'
import { PageTitle } from 'components'
import { ScrollableWindow } from 'components/inputs/scrollable_window'
import { Table } from 'components/table.impl'
import {
  EnOperationType,
  EnSupplyReason,
  EnUnit,
  EnWriteoffReason,
  uiSupplyReason,
  uiUnit,
  uiWriteoffReason
} from 'domain-model'
import { DeleteResourceButton, P } from 'lib/index'
import { formatDateWithTime } from 'lib/utils/formatting'
import { OperationName } from 'metalflow/operations/operation_name'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { Column } from 'react-table'
import { Operation, store } from './operations.store'

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
      Header: 'Тип',
      accessor: data => {
        const isSupply = Number(data.operation_type) === EnOperationType.Supply
        return <Box>{isSupply ? 'Поставка' : 'Списание'}</Box>
      }
    },
    {
      Header: `Объект`,
      id: 'name',
      accessor: data => <OperationName operation={data} showLinkButton={true} />
    },
    {
      Header: 'Количество',
      accessor: data =>
        data.material_label ? (
          <P>
            {data.qty} {uiUnit(data.material_unit as EnUnit)}
          </P>
        ) : (
          <P>{data.qty} шт</P>
        )
    },
    {
      Header: 'Дата',
      accessor: data => {
        return formatDateWithTime(data.timestamp!)
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
            store.revertOperation(data.operation_id)
          }}
        />
      )
    }
  ]
}

export const OperationsList = observer(() => {
  const [key, setKey] = useState(0)
  const columns = useMemo(() => getColumns({ key, setKey }), [key, setKey])
  useEffect(() => {
    store.load()
  }, [])
  return (
    <ScrollableWindow
      refreshTrigger={false}
      staticContent={<PageTitle title={'Журнал операций'} />}
      scrollableContent={
        <Table
          columns={columns}
          data={store.operations}
          trStyleCallback={op => {
            if (Number(op.original.operation_type) === EnOperationType.Supply) {
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

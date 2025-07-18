import { ScrollableWindow } from 'components/inputs'
import { Table } from 'components/table.impl'
import {
  EnManufacturingOrderStatus,
  uiManufacturingOrderStatus
} from 'domain-model'
import { observer } from 'lib/deps'
import {
  Box,
  LoadingHint,
  open,
  P,
  routeMap,
  Stack,
  useEffect,
  useNavigate
} from 'lib/index'
import { DetailName } from 'metalflow/details/name'
import { MetalPageTitle } from 'metalflow/shared/basic'
import { Column } from 'react-table'
import { ManufactoringListOutput, ManufacturingListStore } from './list_store'

const state = new ManufacturingListStore()

const columnList: Column<ManufactoringListOutput>[] = [
  {
    Header: 'ID Заказа',
    accessor: 'id'
  },
  {
    Header: 'Статус',
    accessor: m => {
      return <P>{uiManufacturingOrderStatus(m.status)}</P>
    }
  },
  {
    Header: 'Деталь',
    accessor: d => (
      <DetailName
        detail={{
          id: d.detail_id,
          name: d.detail_name,
          group_id: d.group_id
        }}
        withLink
        withGroupLink
        withParamsButton
      />
    )
  },
  {
    Header: 'Количество',
    accessor: 'qty'
  },
  {
    Header: 'Старт',
    accessor: m => {
      if (!m.started_at) return '-'
      return <P>{formatDate(new Date(m.started_at))}</P>
    }
  },
  {
    Header: 'Финиш',
    accessor: m => {
      if (!m.finished_at) return ''
      return <P>{formatDate(new Date(m.finished_at!))}</P>
    }
  }
]

export const ManufacturingList = observer(() => {
  const navigate = useNavigate()
  useEffect(() => {
    state.load()
  }, [])

  const onRowClick = (row: ManufactoringListOutput) => {
    navigate(open(routeMap.metalflow.manufacturing_order.edit, row.id))
  }

  return (
    <ScrollableWindow
      refreshTrigger={false}
      staticContent={
        <Box p={1}>
          <MetalPageTitle t={'Детали в производстве'} />
        </Box>
      }
      scrollableContent={
        <Stack gap={1} p={1}>
          <LoadingHint show={state.async.loading} />
          <Table
            trStyleCallback={tr => {
              if (tr.original.status === EnManufacturingOrderStatus.Collected) {
                return {
                  backgroundColor: 'lightgreen'
                }
              }
              return {}
            }}
            data={state.orders}
            columns={columnList}
            onRowClick={onRowClick}
          />
        </Stack>
      }
    />
  )
})

function formatDate(date: Date) {
  return Intl.DateTimeFormat('ru-RU', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

import { AccordionGroup } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { DetailName } from 'domains/pdo/detail/name'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import { observer } from 'lib/deps'
import {
  Loading,
  openPage,
  P,
  routeMap,
  Row,
  Stack,
  useEffect,
  useNavigate,
  useState
} from 'lib/index'
import { EnManufacturingOrderStatus, uiManufacturingOrderStatus } from 'models'
import { Column } from 'react-table'
import { listStore, ManufactoringListOutput } from './store'

const columnList: Column<ManufactoringListOutput>[] = [
  {
    Header: '№',
    accessor: 'id'
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
    Header: 'Кол-во',
    accessor: m => {
      if (!m.qty) return ''
      return <P>{m.qty}</P>
    }
  },
  {
    Header: 'Старт',
    accessor: m => {
      return <P>{formatDate(new Date(m.created_at))}</P>
    }
  }
]

const finishColumns = columnList.concat([
  {
    Header: 'Финиш',
    accessor: m => {
      if (!m.finished_at) return ''
      return <P>{formatDate(new Date(m.finished_at!))}</P>
    }
  },
  {
    Header: 'Дельта',
    accessor: m => {
      if (!m.started_at || !m.finished_at) return ''
      const ms =
        new Date(m.finished_at).getTime() - new Date(m.started_at).getTime()
      if (ms <= 0) return ''
      const totalMinutes = Math.floor(ms / 60000)
      const days = Math.floor(totalMinutes / 1440)
      const hours = Math.floor((totalMinutes % 1440) / 60)
      const value = days > 0 ? `${days}д ${hours}ч` : `${hours}ч`
      return <P>{value}</P>
    }
  }
])

function StatusAccordion(props: {
  status: EnManufacturingOrderStatus
  onRowClick: (row: ManufactoringListOutput) => void
  expanded?: boolean
  data: ManufactoringListOutput[]
}) {
  return (
    <AccordionCard
      title={uiManufacturingOrderStatus(props.status)}
      expanded={props.expanded}
    >
      <Table
        data={props.data}
        columns={
          props.status === EnManufacturingOrderStatus.Collected
            ? finishColumns
            : columnList
        }
        onRowClick={props.onRowClick}
      />
    </AccordionCard>
  )
}

export const ManufacturingList = observer(() => {
  const navigate = useNavigate()
  useEffect(() => {
    listStore.load()
  }, [])

  const onRowClick = (row: ManufactoringListOutput) => {
    navigate(openPage(routeMap.pdo.manufacturing_order.edit, row.id))
  }

  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const filtered = q
    ? listStore.orders.filter(o => {
        const idMatch = String(o.id).includes(q)
        const nameMatch = o.detail_name?.toLowerCase().includes(q)
        const groupMatch = String(o.group_id || '').includes(q)
        return idMatch || nameMatch || groupMatch
      })
    : listStore.orders

  const hasInStatus = (s: EnManufacturingOrderStatus) =>
    filtered.some(o => o.status === s)

  if (listStore.async.loading) return <Loading />
  return (
    <ScrollableWindow
      refreshTrigger={false}
      staticContent={
        <Row gap={0}>
          <MetalPageTitle t={'Производство'} />
          <Search value={query} onChange={e => setQuery(e.target.value)} />
        </Row>
      }
      scrollableContent={
        <Stack gap={1}>
          <AccordionGroup>
            {[
              EnManufacturingOrderStatus.Collected,
              EnManufacturingOrderStatus.Production,
              EnManufacturingOrderStatus.MaterialPreparation,
              EnManufacturingOrderStatus.Waiting
            ].map(s => (
              <StatusAccordion
                key={s}
                status={s}
                onRowClick={onRowClick}
                expanded={q ? hasInStatus(s) : undefined}
                data={filtered.filter(o => o.status === s)}
              />
            ))}
          </AccordionGroup>
        </Stack>
      }
    />
  )
})

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('ru-RU', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

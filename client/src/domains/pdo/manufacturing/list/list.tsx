import { AccordionGroup } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import { observer } from 'lib/deps'
import {
  Loading,
  openPage,
  routeMap,
  Row,
  Stack,
  useEffect,
  useNavigate,
  useState
} from 'lib/index'
import { EnManufacturingOrderStatus, uiManufacturingOrderStatus } from 'models'
import { getColumns } from './columns'
import { listStore, ManufactoringListOutput } from './store'

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
        columns={getColumns(props.status)}
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

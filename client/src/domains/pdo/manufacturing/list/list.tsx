import { AccordionGroup } from '@mui/joy'
import { AccordionCard } from 'components/accordion_card'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import { observer } from 'lib/deps'
import {
  Label,
  Loading,
  openPage,
  routeMap,
  Row,
  Stack,
  useEffect,
  useNavigate,
  useState
} from 'lib/index'
import {
  ManufacturingOrderStatus as OrderStatus,
  uiManufacturingOrderStatus
} from 'models'
import { ListManufacturingOutput } from 'srv/rpc/pdo/manufacturing'
import { getColumns } from './columns'
import { s } from './store'

const STATUSES = [
  OrderStatus.Collected,
  OrderStatus.Production,
  OrderStatus.Preparation,
  OrderStatus.Waiting
]

function StatusAccordion(props: {
  status: OrderStatus
  onRowClick: (row: ListManufacturingOutput) => void
  expanded?: boolean
  data: ListManufacturingOutput[]
}) {
  return (
    <AccordionCard
      title={
        <Row>
          {uiManufacturingOrderStatus(props.status)}{' '}
          {props.status === OrderStatus.Production && (
            <Label level="body-xs">[{props.data.length}]</Label>
          )}
        </Row>
      }
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
    s.load()
  }, [])

  const onRowClick = (row: ListManufacturingOutput) => {
    navigate(openPage(routeMap.pdo.manufacturing_order.edit, row.id))
  }

  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const filtered = q
    ? s.orders.filter(o => {
        const idMatch = String(o.id).includes(q)
        const nameMatch = o.detail_name?.toLowerCase().includes(q)
        const groupMatch = String(o.group_id || '').includes(q)
        return idMatch || nameMatch || groupMatch
      })
    : s.orders

  const hasInStatus = (s: OrderStatus) => filtered.some(o => o.status === s)

  if (s.async.loading) return <Loading />
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
            {STATUSES.map(s => (
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

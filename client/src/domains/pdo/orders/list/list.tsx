import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { TabConfig } from 'components/tabs'
import { cache } from 'domains/pdo/cache/root'
import { MobileNavModal } from 'domains/pdo/root_layout'
import { makeAutoObservable, observer } from 'lib/deps'
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
import { ManufacturingOrderStatus as OrderStatus } from 'models'
import { ListOrdersOutput } from 'srv/rpc/pdo/orders'
import { getColumns } from './columns'
import { s } from './store'

const getTabConfig = (
  data: ListOrdersOutput[],
  onRowClick: (row: ListOrdersOutput) => void
): TabConfig => [
  {
    value: OrderStatus.Preparation,
    label: 'Подготовка',
    component: (
      <Stack>
        <Label px={1}>Подготовка</Label>
        <Table
          onRowClick={onRowClick}
          data={data.filter(e => e.status == OrderStatus.Preparation)}
          columns={getColumns(OrderStatus.Preparation)}
        />
        <Label px={1}>Ожидание</Label>
        <Table
          onRowClick={onRowClick}
          data={data.filter(e => e.status == OrderStatus.Waiting)}
          columns={getColumns(OrderStatus.Waiting)}
        />
      </Stack>
    )
  },
  {
    value: OrderStatus.Production,
    label: 'Производство',
    component: (
      <>
        <Label xs px={1}>
          {data.filter(e => e.status == OrderStatus.Production).length} заказов
        </Label>
        <Table
          onRowClick={onRowClick}
          data={data.filter(e => e.status == OrderStatus.Production)}
          columns={getColumns(OrderStatus.Production)}
        />
      </>
    )
  },
  {
    value: OrderStatus.Collected,
    label: 'Завершенные',
    component: (
      <>
        <Label xs px={1}>
          За последние 30 дней
        </Label>
        <Table
          onRowClick={onRowClick}
          data={data.filter(e => e.status == OrderStatus.Collected)}
          columns={getColumns(OrderStatus.Collected)}
        />
      </>
    )
  }
]

class ManufacturingListState {
  constructor() {
    makeAutoObservable(this)
  }
  tab: number = OrderStatus.Production
  setTab(v: OrderStatus) {
    this.tab = v
  }
}

const list_state = new ManufacturingListState()

export const ManufacturingList = observer(() => {
  const navigate = useNavigate()

  useEffect(() => {
    s.load()
  }, [])

  const onRowClick = (row: ListOrdersOutput) => {
    navigate(openPage(routeMap.pdo.order.edit, row.id))
  }
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const filtered = q
    ? s.orders.filter(order => {
        const id_match = String(order.id).includes(q)
        const name_match = order.detail_name?.toLowerCase().includes(q)
        const group_match = String(
          cache.detailGroups.getGroupName(order.group_id)?.toLowerCase() || ''
        ).includes(q)
        return id_match || name_match || group_match
      })
    : s.orders

  if (s.async.loading) return <Loading />
  const tabs = getTabConfig(filtered, onRowClick)
  return (
    <Tabs
      variant="plain"
      value={list_state.tab}
      onChange={(_, v) => list_state.setTab(v as OrderStatus)}
      size="sm"
    >
      <ScrollableWindow
        static={
          <Stack gap={0.5}>
            <MobileNavModal t={'Производство'} />
            <TabList variant="soft" color="primary">
              {tabs.map(({ value, label }) => (
                <Tab
                  indicatorInset
                  indicatorPlacement="top"
                  key={value}
                  value={value}
                  color={'primary'}
                  variant={list_state.tab == value ? 'outlined' : 'plain'}
                >
                  {label}
                </Tab>
              ))}
            </TabList>
            <Row gap={0} px={1}>
              <Search
                size="sm"
                variant="soft"
                color="primary"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </Row>
          </Stack>
        }
        scroll={
          <Stack gap={0} pt={0} sx={{ mb: 2 }}>
            {tabs.map(({ value, component }) => (
              <TabPanel key={value} value={value} sx={{ p: 0 }}>
                {component}
              </TabPanel>
            ))}
          </Stack>
        }
      />
    </Tabs>
  )
})

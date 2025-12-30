import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { TabConfig } from 'components/tabs'
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
        <Label>Подготовка</Label>
        <Table
          onRowClick={onRowClick}
          data={data.filter(e => e.status == OrderStatus.Preparation)}
          columns={getColumns(OrderStatus.Preparation)}
        />
        <Label>Ожидание</Label>
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
        <Label level="body-xs" color="neutral">
          {data.filter(e => e.status == OrderStatus.Production).length} заказов
          в производстве
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
        <Label level="body-xs">За последние 14 дней</Label>
        <Table
          onRowClick={onRowClick}
          data={data.filter(e => e.status == OrderStatus.Collected)}
          columns={getColumns(OrderStatus.Collected)}
        />
      </>
    )
  }
]

export const ManufacturingList = observer(() => {
  const navigate = useNavigate()
  const [tab, setTab] = useState(OrderStatus.Production)
  useEffect(() => {
    s.load()
  }, [])

  const onRowClick = (row: ListOrdersOutput) => {
    navigate(openPage(routeMap.pdo.order.edit, row.id))
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

  const tabs = getTabConfig(filtered, onRowClick)
  return (
    <Tabs
      variant="outlined"
      color="primary"
      value={tab}
      onChange={(_, v) => setTab(v as OrderStatus)}
      size="sm"
    >
      <ScrollableWindow
        refreshTrigger={false}
        staticContent={
          <Stack gap={0.5}>
            <TabList
              variant="soft"
              color="primary"
              sx={{ width: 'fit-content' }}
            >
              {tabs.map(({ value, label }) => (
                <Tab
                  indicatorInset
                  indicatorPlacement="top"
                  sx={{
                    fontSize: {
                      xs: '12px',
                      sm: 'inherit'
                    },
                    padding: {
                      xs: 0.3,
                      sm: '0px 12px'
                    }
                  }}
                  key={value}
                  value={value}
                  color={'primary'}
                  variant={tab == value ? 'outlined' : 'plain'}
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
        scrollableContent={
          <Stack gap={0} pt={0}>
            {tabs.map(({ value, component }) => (
              <TabPanel key={value} value={value}>
                {component}
              </TabPanel>
            ))}
          </Stack>
        }
      />
    </Tabs>
  )
})

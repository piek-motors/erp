import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { TabConfig } from 'components/tabs'
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
import { ManufacturingOrderStatus as OrderStatus } from 'models'
import { ListManufacturingOutput } from 'srv/rpc/pdo/manufacturing'
import { getColumns } from './columns'
import { s } from './store'

function getTabConfig(
  data: ListManufacturingOutput[],
  onRowClick: (row: ListManufacturingOutput) => void
): TabConfig {
  return [
    {
      value: OrderStatus.Waiting,
      label: 'Ожидание'
    },
    {
      value: OrderStatus.Preparation,
      label: 'Подготовка'
    },
    {
      value: OrderStatus.Production,
      label: 'Производство'
    },
    {
      value: OrderStatus.Collected,
      label: 'Завершенные'
    }
  ].map(each => ({
    ...each,
    component: (
      <Table
        onRowClick={onRowClick}
        data={data.filter(e => e.status === each.value)}
        columns={getColumns(each.value)}
      />
    )
  }))
}

export const ManufacturingList = observer(() => {
  const navigate = useNavigate()
  const [tab, setTab] = useState(OrderStatus.Production)
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

  const tabs = getTabConfig(filtered, onRowClick)
  return (
    <Tabs
      variant="outlined"
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
              color="warning"
              sx={{ width: 'fit-content' }}
            >
              {tabs.map(({ value, label }) => (
                <Tab
                  sx={{
                    fontSize: {
                      xs: '12px',
                      sm: 'inherit'
                    },
                    padding: {
                      xs: 0.3,
                      sm: 1
                    }
                  }}
                  key={value}
                  color={tab == value ? 'primary' : 'neutral'}
                  variant={tab == value ? 'outlined' : 'plain'}
                >
                  {label}
                </Tab>
              ))}
            </TabList>
            <Row gap={0} px={1}>
              <Search value={query} onChange={e => setQuery(e.target.value)} />
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

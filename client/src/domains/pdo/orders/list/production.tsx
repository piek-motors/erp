import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import {
  ProductionOrderStatus as OrderStatus,
  ProductionOrderStatus,
} from 'shared'
import { ScrollableWindow } from '@/components/inputs'
import { SearchWithCriteria } from '@/components/inputs/search_input_with_criteria'
import { Table } from '@/components/table.impl'
import { MobileNavModal, MobilePadding } from '@/domains/pdo/root_layout'
import { observer } from '@/lib/deps'
import {
  Label,
  Loading,
  openPage,
  Row,
  routeMap,
  Stack,
  useEffect,
  useNavigate,
} from '@/lib/index'
import type { ListOrdersOutput } from '@/server/domains/pdo/orders_rpc'
import { ArchiveResults, ArchiveSearch } from './archive'
import { getColumns } from './columns'
import { order_list_vm } from './order_list_vm'
import { SearchCriteria } from './search_config'

const PreparationTab = observer(
  ({ onRowClick }: { onRowClick: (row: ListOrdersOutput) => void }) => (
    <Stack>
      <Label px={1}>Подготовка</Label>
      <Table
        onRowClick={onRowClick}
        data={order_list_vm.preparation_orders}
        columns={getColumns(OrderStatus.Preparation)}
      />
      <Label px={1}>Ожидание</Label>
      <Table
        onRowClick={onRowClick}
        data={order_list_vm.waiting_orders}
        columns={getColumns(OrderStatus.Waiting)}
      />
    </Stack>
  ),
)

const ProductionTab = observer(
  ({ onRowClick }: { onRowClick: (row: ListOrdersOutput) => void }) => (
    <>
      <Label xs px={1}>
        {order_list_vm.production_orders.length} заказов
      </Label>
      <Table
        onRowClick={onRowClick}
        data={order_list_vm.production_orders}
        columns={getColumns(OrderStatus.Production)}
      />
    </>
  ),
)

const OrderSearch = observer(() => {
  if (order_list_vm.tab === ProductionOrderStatus.Archived)
    return <ArchiveSearch />
  return (
    <SearchWithCriteria
      criteria={order_list_vm.search_criteria}
      criteriaOptions={SearchCriteria}
      onCriteriaChange={c => order_list_vm.set_search_criteria(c)}
      query={order_list_vm.query}
      onQueryChange={q => order_list_vm.set_query(q)}
      variant="soft"
      color="primary"
    />
  )
})

export const ProductionOrderList = observer(() => {
  const navigate = useNavigate()

  useEffect(() => {
    order_list_vm.load()
  }, [])

  if (order_list_vm.async.loading) return <Loading />

  const onRowClick = (row: ListOrdersOutput) => {
    navigate(openPage(routeMap.pdo.order.edit, row.id))
  }

  return (
    <Tabs
      variant="plain"
      value={order_list_vm.tab}
      onChange={(_, v) => order_list_vm.set_tab(v as OrderStatus)}
      size="sm"
    >
      <ScrollableWindow
        static={
          <Stack>
            <MobilePadding>
              <MobileNavModal t="Производство" />
            </MobilePadding>
            <TabList variant="soft" color="primary">
              {TAB_LABELS.map(({ value, label }) => (
                <Tab
                  indicatorInset
                  indicatorPlacement="top"
                  key={value}
                  value={value}
                  color="primary"
                  variant={order_list_vm.tab === value ? 'outlined' : 'plain'}
                >
                  {label}
                </Tab>
              ))}
            </TabList>
            <Row gap={0} p={0.5}>
              <OrderSearch />
            </Row>
          </Stack>
        }
        scroll={
          <Stack sx={{ mb: 2 }}>
            <TabPanel value={OrderStatus.Preparation} sx={{ p: 0 }}>
              <PreparationTab onRowClick={onRowClick} />
            </TabPanel>
            <TabPanel value={OrderStatus.Production} sx={{ p: 0 }}>
              <ProductionTab onRowClick={onRowClick} />
            </TabPanel>
            <TabPanel value={OrderStatus.Archived} sx={{ p: 0 }}>
              <ArchiveResults onRowClick={onRowClick} />
            </TabPanel>
          </Stack>
        }
      />
    </Tabs>
  )
})

const TAB_LABELS = [
  { value: OrderStatus.Preparation, label: 'Подготовка' },
  { value: OrderStatus.Production, label: 'Производство' },
  { value: OrderStatus.Archived, label: 'Архив' },
]

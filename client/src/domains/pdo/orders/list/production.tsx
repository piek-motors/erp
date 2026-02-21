import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { action, makeAutoObservable, runInAction } from 'mobx'
import {
  ProductionOrderStatus as OrderStatus,
  ProductionOrderStatus,
} from 'models'
import { ScrollableWindow } from '@/components/inputs'
import { SearchWithCriteria } from '@/components/inputs/search_input_with_criteria'
import { Table } from '@/components/table.impl'
import { app_cache } from '@/domains/pdo/cache'
import { MobileNavModal, MobilePadding } from '@/domains/pdo/root_layout'
import { observer, rpc } from '@/lib/deps'
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
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { LoadingController } from '@/lib/store/loading_controller'
import { debounce } from '@/lib/utils/debounce'
import {
  type CriteriaBasedSearchConfig,
  token_search,
} from '@/lib/utils/search'
import type { ListOrdersOutput } from '@/server/domains/pdo/orders_rpc'
import { ArchiveResults, ArchiveSearch } from './archive'
import { getColumns } from './columns'

export enum SearchCriteria {
  Id = '№',
  Detail = 'Деталь',
  Operation = 'Операция',
  Group = 'Группа',
}

const search_config: CriteriaBasedSearchConfig<
  ListOrdersOutput,
  SearchCriteria
> = {
  [SearchCriteria.Id]: {
    fields: [{ get: o => String(o.id), match: 'exact' }],
  },
  [SearchCriteria.Detail]: {
    fields: [
      { get: o => o.detail_name, weight: 3 },
      { get: o => String(o.id), match: 'exact' },
    ],
  },
  [SearchCriteria.Operation]: {
    fields: [{ get: o => o.current_operation || '', match: 'start_with' }],
  },
  [SearchCriteria.Group]: {
    fields: [{ get: o => app_cache.groups.name_for(o.group_id) ?? '' }],
  },
}

export class OrderListSt {
  readonly async = new LoadingController()

  tab: number = OrderStatus.Production
  orders: ListOrdersOutput[] = []
  query: string = ''
  private debouncedQuery: string = ''
  search_criteria = SearchCriteria.Detail

  private readonly runDebouncedSearch: () => void

  constructor() {
    makeAutoObservable(this)

    // action() wrapper is critical — without it MobX processes the mutation
    // outside a transaction, causing multiple recomputations per keystroke
    this.runDebouncedSearch = debounce(
      action(() => {
        this.debouncedQuery = this.query
      }),
      300,
    )
  }

  set_tab(v: OrderStatus) {
    this.tab = v
  }
  set_search_criteria(c: SearchCriteria) {
    this.search_criteria = c
  }
  set_query(q: string) {
    this.query = q
    this.runDebouncedSearch()
  }

  // Single source of truth — status filtering is derived here once,
  // MobX caches this computed and only recomputes when orders/query/criteria change
  get filtered() {
    const q = this.debouncedQuery.trim()
    if (!q) return this.orders
    return token_search(this.orders, q, search_config[this.search_criteria])
  }

  // Derived from filtered — MobX caches each independently,
  // so switching tabs doesn't re-run token_search
  get preparation_orders() {
    return this.filtered.filter(e => e.status === OrderStatus.Preparation)
  }
  get waiting_orders() {
    return this.filtered.filter(e => e.status === OrderStatus.Waiting)
  }
  get production_orders() {
    return this.filtered.filter(e => e.status === OrderStatus.Production)
  }

  async load() {
    this.async.run(async () => {
      const orders = matrixDecoder<ListOrdersOutput>(
        await rpc.pdo.orders.list.query(),
      )
      runInAction(() => {
        this.orders = orders
      })
    })
  }

  async finish(id: number) {
    await rpc.pdo.orders_mut.finish.mutate({ id })
    this.load()
  }

  async delete(id: number) {
    await rpc.pdo.orders_mut.delete.mutate({ id })
    this.load()
  }
}

export const state = new OrderListSt()

const PreparationTab = observer(
  ({ onRowClick }: { onRowClick: (row: ListOrdersOutput) => void }) => (
    <Stack>
      <Label px={1}>Подготовка</Label>
      <Table
        onRowClick={onRowClick}
        data={state.preparation_orders}
        columns={getColumns(OrderStatus.Preparation)}
      />
      <Label px={1}>Ожидание</Label>
      <Table
        onRowClick={onRowClick}
        data={state.waiting_orders}
        columns={getColumns(OrderStatus.Waiting)}
      />
    </Stack>
  ),
)

const ProductionTab = observer(
  ({ onRowClick }: { onRowClick: (row: ListOrdersOutput) => void }) => (
    <>
      <Label xs px={1}>
        {state.production_orders.length} заказов
      </Label>
      <Table
        onRowClick={onRowClick}
        data={state.production_orders}
        columns={getColumns(OrderStatus.Production)}
      />
    </>
  ),
)

const OrderSearch = observer(() => {
  if (state.tab === ProductionOrderStatus.Archived) return <ArchiveSearch />
  return (
    <SearchWithCriteria
      criteria={state.search_criteria}
      criteriaOptions={SearchCriteria}
      onCriteriaChange={c => state.set_search_criteria(c)}
      query={state.query}
      onQueryChange={q => state.set_query(q)}
      variant="soft"
      color="primary"
    />
  )
})

export const ProductionOrderList = observer(() => {
  const navigate = useNavigate()

  useEffect(() => {
    state.load()
  }, [])

  if (state.async.loading) return <Loading />

  const onRowClick = (row: ListOrdersOutput) => {
    navigate(openPage(routeMap.pdo.order.edit, row.id))
  }

  return (
    <Tabs
      variant="plain"
      value={state.tab}
      onChange={(_, v) => state.set_tab(v as OrderStatus)}
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
                  variant={state.tab === value ? 'outlined' : 'plain'}
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

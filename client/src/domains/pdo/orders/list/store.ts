import { app_cache } from '@/domains/pdo/cache'
import { rpc } from '@/lib/deps'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { LoadingController } from '@/lib/store/loading_controller'
import { debounce } from '@/lib/utils/debounce'
import { type SearchConfig, token_search } from '@/lib/utils/search'
import type { ListOrdersOutput } from '@/server/domains/pdo/orders_rpc'
import { makeAutoObservable, reaction } from 'mobx'
import { ProductionOrderStatus as OrderStatus } from 'models'

export enum OrderSearchCriteria {
  Id = '№',
  Detail = 'Деталь',
  Operation = 'Операция',
  Group = 'Группа',
}

const search_config: Record<
  OrderSearchCriteria,
  SearchConfig<ListOrdersOutput>
> = {
  [OrderSearchCriteria.Id]: {
    fields: [
      {
        get: o => String(o.id),
        match: 'exact',
      },
    ],
  },
  [OrderSearchCriteria.Detail]: {
    fields: [
      {
        get: o => o.detail_name,
        weight: 3,
      },
      {
        get: o => String(o.id),
        match: 'exact',
      },
    ],
  },
  [OrderSearchCriteria.Operation]: {
    fields: [
      {
        get: o => o.current_operation || '',
        match: 'start_with',
      },
    ],
  },
  [OrderSearchCriteria.Group]: {
    fields: [
      {
        get: o => app_cache.detailGroups.getGroupName(o.group_id) ?? '',
      },
    ],
  },
}

export class OrderListSt {
  readonly async = new LoadingController()
  private readonly runDebouncedSearch: () => void

  tab: number = OrderStatus.Production
  setTab(v: OrderStatus) {
    this.tab = v
  }

  orders: ListOrdersOutput[] = []
  setOrders(orders: ListOrdersOutput[]) {
    this.orders = orders
  }

  query: string = ''
  private debouncedQuery: string = ''

  set_query(q: string) {
    this.query = q
    this.runDebouncedSearch()
  }

  search_criteria = OrderSearchCriteria.Detail
  set_search_criteria(c: OrderSearchCriteria) {
    this.search_criteria = c
  }

  constructor() {
    makeAutoObservable(this)

    this.runDebouncedSearch = debounce(() => {
      this.debouncedQuery = this.query
    }, 300)
  }

  async load() {
    this.async.run(async () => {
      const encodedOrders = await rpc.pdo.orders.list.query()
      const orders = matrixDecoder<ListOrdersOutput>(encodedOrders)
      this.setOrders(orders)
    })
  }

  async finishManufacturing(id: number) {
    await rpc.pdo.orders_mut.finish.mutate({ id })
    this.load()
  }

  async deleteOrder(id: number) {
    await rpc.pdo.orders_mut.delete.mutate({ id })
    this.load()
  }

  get filtered() {
    const q = this.debouncedQuery.trim()

    if (!q) {
      return this.orders
    }

    const config = search_config[this.search_criteria]
    return token_search(this.orders, q, config)
  }
}

export const s = new OrderListSt()

export class ArchiveSearchStore {
  readonly loader = new LoadingController()

  query: string = ''
  setQuery(query: string) {
    this.query = query
  }

  private results: ListOrdersOutput[] = []
  private setResults(orders: ListOrdersOutput[]) {
    this.results = orders
  }

  private last_archived_orders: ListOrdersOutput[] = []
  private setLastArchivedOrders(orders: ListOrdersOutput[]) {
    this.last_archived_orders = orders
  }

  get show_last_archived_orders() {
    return !this.query
  }

  get orders_to_render() {
    return this.show_last_archived_orders
      ? this.last_archived_orders
      : this.results
  }

  constructor() {
    makeAutoObservable(this)

    // Auto-search on query change
    reaction(
      () => this.query,
      query => {
        if (query.trim().length > 0) {
          this.search(query)
        } else {
          this.clear()
        }
      },
    )
  }

  async search(term: string) {
    this.loader.run(async () => {
      const encodedOrders = await rpc.pdo.orders.search_in_archive.query({
        term,
      })
      const orders = matrixDecoder<ListOrdersOutput>(encodedOrders)
      this.setResults(orders)
    })
  }

  async init() {
    this.loader.run(async () => {
      const encodedOrders = await rpc.pdo.orders.list_last_archived.query()
      const orders = matrixDecoder<ListOrdersOutput>(encodedOrders)
      this.setLastArchivedOrders(orders)
    })
  }

  clear() {
    this.results = []
  }
}

export const archive_search = new ArchiveSearchStore()

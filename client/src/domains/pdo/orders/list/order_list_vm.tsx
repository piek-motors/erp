import { action, makeAutoObservable, runInAction } from 'mobx'
import { ProductionOrderStatus as OrderStatus } from 'models'
import { rpc } from '@/lib/deps'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { LoadingController } from '@/lib/store/loading_controller'
import { debounce } from '@/lib/utils/debounce'
import { token_search } from '@/lib/utils/search'
import type { ListOrdersOutput } from '@/server/domains/pdo/orders_rpc'
import { SearchCriteria, search_config } from './search_config'

export class OrderListVM {
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

export const order_list_vm = new OrderListVM()

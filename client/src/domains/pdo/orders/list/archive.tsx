import { action, makeAutoObservable, reaction, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ProductionOrderStatus as OrderStatus } from 'models'
import { useEffect } from 'react'
import { Search } from '@/components/inputs'
import { Table } from '@/components/table.impl'
import { Label } from '@/lib'
import { rpc } from '@/lib/deps'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { LoadingController } from '@/lib/store/loading_controller'
import { debounce } from '@/lib/utils/debounce'
import type { ListOrdersOutput } from '@/server/domains/pdo/orders_rpc'
import { getColumns } from './columns'

export class ArchiveSearchStore {
  readonly loader = new LoadingController()

  query: string = ''
  private results: ListOrdersOutput[] = []
  private last_archived_orders: ListOrdersOutput[] = []
  private requestId = 0 // guards against stale out-of-order responses

  constructor() {
    makeAutoObservable(this)

    // Debounced + min-length guard — previously fired a network request
    // on every single keystroke
    const debouncedSearch = debounce(
      action((query: string) => {
        if (query.trim().length >= 2) {
          this.search(query)
        } else {
          this.clear()
        }
      }),
      300,
    )

    reaction(
      () => this.query,
      query => {
        if (query.trim().length === 0) {
          this.clear()
        } else {
          debouncedSearch(query)
        }
      },
    )
  }

  setQuery(query: string) {
    this.query = query
  }

  get show_last_archived_orders() {
    return !this.query
  }
  get orders_to_render() {
    return this.show_last_archived_orders
      ? this.last_archived_orders
      : this.results
  }

  async search(term: string) {
    const id = ++this.requestId // if a newer request fires before this resolves, discard result
    this.loader.run(async () => {
      const orders = matrixDecoder<ListOrdersOutput>(
        await rpc.pdo.orders.search_in_archive.query({ term }),
      )
      if (id !== this.requestId) return
      runInAction(() => {
        this.results = orders
      })
    })
  }

  async init() {
    this.loader.run(async () => {
      const orders = matrixDecoder<ListOrdersOutput>(
        await rpc.pdo.orders.list_last_archived.query(),
      )
      runInAction(() => {
        this.last_archived_orders = orders
      })
    })
  }

  clear() {
    this.results = []
  }
}

export const archive_search = new ArchiveSearchStore()

export const ArchiveSearch = observer(() => (
  <Search
    size="sm"
    color="primary"
    variant="soft"
    value={archive_search.query}
    onChange={e => archive_search.setQuery(e.target.value)}
  />
))

export const ArchiveResults = observer(
  ({ onRowClick }: { onRowClick: (row: ListOrdersOutput) => void }) => {
    useEffect(() => {
      archive_search.init()
    }, [])

    return (
      <>
        {archive_search.show_last_archived_orders && (
          <Label xs px={1}>
            За последние 30 дней
          </Label>
        )}
        <Table
          onRowClick={onRowClick}
          data={archive_search.orders_to_render}
          columns={getColumns(OrderStatus.Archived)}
        />
        {archive_search.loader.loading && (
          <Label xs px={1}>
            Загрузка...
          </Label>
        )}
      </>
    )
  },
)

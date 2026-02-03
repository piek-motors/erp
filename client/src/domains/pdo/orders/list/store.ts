import { app_cache } from 'domains/pdo/cache'
import { rpc } from 'lib/deps'
import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { LoadingController } from 'lib/store/loading_controller'
import { debounce } from 'lib/utils/debounce'
import { SearchConfig, tokenSearch, toNormalForm } from 'lib/utils/search'
import { makeAutoObservable, reaction } from 'mobx'
import { ManufacturingOrderStatus as OrderStatus } from 'models'
import type { ListOrdersOutput } from 'srv/domains/pdo/orders_rpc'

export enum OrderSearchCriteria {
	Id = 'N',
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
				exact: true,
			},
		],
	},
	[OrderSearchCriteria.Detail]: {
		fields: [
			{
				get: o => toNormalForm(o.detail_name),
				weight: 3,
			},
			{
				get: o => String(o.id),
				exact: true,
			},
		],
	},
	[OrderSearchCriteria.Operation]: {
		fields: [
			{
				get: o => toNormalForm(o.current_operation),
			},
		],
	},
	[OrderSearchCriteria.Group]: {
		fields: [
			{
				get: o => toNormalForm(app_cache.detailGroups.getGroupName(o.group_id)),
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
		return tokenSearch(this.orders, q, config)
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

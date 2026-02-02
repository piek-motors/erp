import { app_cache } from 'domains/pdo/cache'
import { rpc } from 'lib/deps'
import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable, reaction } from 'mobx'
import { ManufacturingOrderStatus as OrderStatus } from 'models'
import type { ListOrdersOutput } from 'srv/domains/pdo/orders'

export class ManufacturingListStore {
	readonly async = new LoadingController()

	tab: number = OrderStatus.Production
	setTab(v: OrderStatus) {
		this.tab = v
	}

	orders: ListOrdersOutput[] = []
	setOrders(orders: ListOrdersOutput[]) {
		this.orders = orders
	}

	query?: string
	setQuery(query?: string) {
		this.query = query
	}

	get filtered() {
		const filter = this.query?.trim().toLocaleLowerCase()

		const filtered = filter
			? s.orders.filter(order => {
					const id_match = String(order.id).includes(filter)
					const name_match = order.detail_name?.toLowerCase().includes(filter)
					const group_match = String(
						app_cache.detailGroups
							.getGroupName(order.group_id)
							?.toLowerCase() || '',
					).includes(filter)
					return id_match || name_match || group_match
				})
			: s.orders

		return filtered
	}

	constructor() {
		makeAutoObservable(this)
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
}

export const s = new ManufacturingListStore()

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

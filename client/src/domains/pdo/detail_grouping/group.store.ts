import { makeAutoObservable } from 'mobx'
import { notifier } from '@/lib/store/notifier.store'
import { normalize, token_search } from '@/lib/utils/search'
import { app_cache } from '../cache'
import type { DetailSt } from '../detail/detail.state'
import { SearchCriteria, search_config } from '../detail/list/search_config'
import {
  type DetailClaimRequestListItem,
  detail_request_api,
} from '../detail_requests/api'
import type { DetailRequestFormDetail } from '../detail_requests/form.store'

interface DetailRequestQty {
  detail_id: number
  qty: number
}

class EditGroupVM {
  constructor() {
    makeAutoObservable(this)
  }

  name: string = ''
  set_name(name: string) {
    this.name = name
  }

  is_open: boolean = false
  set_is_open(open: boolean) {
    this.is_open = open
  }
}

class CreateSubGroupVM {
  constructor() {
    makeAutoObservable(this)
  }

  parent_id: number | null = null

  open(parent_id: number) {
    this.parent_id = parent_id
  }

  get is_open() {
    return !!this.parent_id
  }

  close() {
    this.parent_id = null
  }
}

export interface Group {
  id: number
  name: string
  parent_id?: number | null
}

export interface GroupTreeNode extends Group {
  children: GroupTreeNode[]
  depth: number
}

export interface GroupWithDetails {
  group: Group
  details: DetailSt[]
}

class QuantityListItem {
  constructor(
    public id: number,
    public qty: number | null = null,
  ) {
    makeAutoObservable(this)
  }

  set_qty(n: number | null) {
    this.qty = n
  }
}

class QuantityList {
  items: QuantityListItem[] = []

  set(id: number, qty: number | null) {
    const item = this.get(id)
    if (item) {
      item.set_qty(qty)
      return
    }

    this.items.push(new QuantityListItem(id, qty))
  }

  get(id: number): QuantityListItem | undefined {
    return this.items.find(e => e.id === id)
  }

  clear() {
    this.items = []
  }

  constructor() {
    makeAutoObservable(this)
  }

  has_something() {
    return (
      this.items.length !== 0 &&
      this.items.some(e => e.qty != null && e.qty > 0)
    )
  }
}

class AddToRequirementVM {
  requests: DetailClaimRequestListItem[] = []
  selected_request_id: number | null = null
  requests_loaded = false

  constructor(private readonly group_content: GroupContentVM) {
    makeAutoObservable(this)
  }

  async load_open_requests() {
    const requests = (await detail_request_api.list()).filter(
      request => !request.fulfilled_at && !request.sent_to_warehouse_at,
    )

    this.set_requests(requests)
    this.requests_loaded = true
  }

  set_selected_request_id(id: number | null) {
    this.selected_request_id = id
  }

  get can_add() {
    return !!this.selected_request_id && this.selected_details.length > 0
  }

  get has_open_requests() {
    return this.requests.length > 0
  }

  get loading() {
    return detail_request_api.loader.loading
  }

  get initial_product_name() {
    return this.group_content.group
      ? (app_cache.groups.tree.full_node_name(this.group_content.group.id) ??
          '')
      : ''
  }

  get initial_details(): DetailRequestFormDetail[] {
    return this.group_content.qty_list.items.reduce<DetailRequestFormDetail[]>(
      (acc, item) => {
        if (!item.qty || item.qty <= 0) return acc

        const detail = this.group_content.details.find(d => d.id === item.id)
        if (!detail) return acc

        acc.push({
          detail_id: detail.id,
          detail_name: detail.name,
          drawing_number: detail.drawing_number ?? undefined,
          qty: item.qty,
        })
        return acc
      },
      [],
    )
  }

  get selected_details(): DetailRequestQty[] {
    return this.group_content.qty_list.items.reduce<DetailRequestQty[]>(
      (acc, item) => {
        if (!item.qty || item.qty <= 0) return acc

        const detail = this.group_content.details.find(d => d.id === item.id)
        if (!detail) return acc

        acc.push({
          detail_id: detail.id,
          qty: item.qty,
        })
        return acc
      },
      [],
    )
  }

  async add_to_selected_request() {
    if (!this.selected_request_id || !this.can_add) return

    const request = await detail_request_api.get(this.selected_request_id)
    const detailQtyById = new Map<number, number>()

    request.details.forEach(detail => {
      detailQtyById.set(detail.detail_id, detail.qty)
    })

    this.selected_details.forEach(detail => {
      detailQtyById.set(
        detail.detail_id,
        (detailQtyById.get(detail.detail_id) ?? 0) + detail.qty,
      )
    })

    await detail_request_api.update({
      id: request.request.id,
      order_id: request.request.order_id,
      product_name: request.request.product_name,
      product_qty: request.request.product_qty,
      details: Array.from(detailQtyById, ([detail_id, qty]) => ({
        detail_id,
        qty,
      })),
    })

    notifier.ok('Детали добавлены в требование')
    this.group_content.qty_list.clear()
    await this.load_open_requests()
  }

  async after_create_saved() {
    this.group_content.qty_list.clear()
    await this.load_open_requests()
  }

  private set_requests(requests: DetailClaimRequestListItem[]) {
    this.requests = requests
    if (requests.length === 1) {
      this.selected_request_id = requests[0].id
      return
    }

    this.selected_request_id =
      this.selected_request_id &&
      requests.some(request => request.id === this.selected_request_id)
        ? this.selected_request_id
        : null
  }
}

export class GroupContentVM {
  qty_list: QuantityList = new QuantityList()
  readonly add_to_requirement = new AddToRequirementVM(this)
  // currently opened group
  group: Group | null = null

  details: DetailSt[] = []
  query: string = ''
  search_criteria = SearchCriteria.Name

  constructor() {
    makeAutoObservable(this)
  }

  set_query(q: string) {
    this.query = q
  }

  set_search_criteria(c: SearchCriteria) {
    this.search_criteria = c
  }

  get_filtered_and_sorted(): DetailSt[] {
    return this.sort_details(this.filter_details_by_query())
  }

  private filter_details_by_query(): DetailSt[] {
    if (!this.query) {
      return this.details
    }

    const n_query = normalize(this.query)
    return token_search(
      this.details,
      n_query,
      search_config[this.search_criteria],
    )
  }

  private sort_details(details: DetailSt[]): DetailSt[] {
    return details.slice().sort((a, b) =>
      a.name.localeCompare(b.name, 'ru', {
        numeric: true,
        sensitivity: 'base',
      }),
    )
  }

  reset() {
    this.query = ''
    this.search_criteria = SearchCriteria.Name
    this.details = []
    this.group = null
  }
}

export class GroupExplorerVM {
  readonly edit_group_modal = new EditGroupVM()
  readonly create_subgroup_modal = new CreateSubGroupVM()
  readonly group_content = new GroupContentVM()

  constructor() {
    makeAutoObservable(this)
  }

  open_group(group: Group | null, details: DetailSt[]) {
    this.group_content.details = details
    this.group_content.group = group
    this.edit_group_modal.set_name(group?.name || '')
  }
}
export const store = new GroupExplorerVM()
export const detail_groups_vm = store

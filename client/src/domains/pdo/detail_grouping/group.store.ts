import { makeAutoObservable, toJS } from 'mobx'
import { normalize, token_search } from '@/lib/utils/search'
import type { DetailSt } from '../detail/detail.state'
import { SearchCriteria, search_config } from '../detail/list/search_config'

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
    public qty: number,
  ) {
    makeAutoObservable(this)
  }

  set_qty(n: number) {
    this.qty = n
  }
}

class QuantityList {
  items: QuantityListItem[] = []

  set(id: number, qty: number) {
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
}

export class GroupContentVM {
  qty_list: QuantityList = new QuantityList()
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

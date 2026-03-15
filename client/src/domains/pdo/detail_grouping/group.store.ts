import { makeAutoObservable } from 'mobx'
import type { DetailSt } from '../detail/detail.state'

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

export class GroupContentVM {
  // currently opened group
  group: Group | null = null

  details: DetailSt[] = []
  query: string = ''

  constructor() {
    makeAutoObservable(this)
  }

  set_query(q: string) {
    this.query = q
  }

  get_filtered_and_sorted(): DetailSt[] {
    return this.sort_details(this.filter_details_by_query())
  }

  private get_query_tokens(): string[] {
    return this.query?.toLowerCase().split(/\s+/).filter(Boolean) ?? []
  }

  private filter_details_by_query(): DetailSt[] {
    const tokens = this.get_query_tokens()

    if (tokens.length === 0) {
      return this.details
    }

    return this.details.filter(detail =>
      this.matches_all_tokens(detail.name, tokens),
    )
  }

  private matches_all_tokens(text: string, tokens: string[]): boolean {
    const value = text.toLowerCase()
    return tokens.every(token => value.includes(token))
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

  clear() {
    this.group_content.reset()
  }
}
export const store = new GroupExplorerVM()
export const detail_groups_vm = store

import { makeAutoObservable } from 'mobx'
import { app_cache } from '@/domains/pdo/cache'
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
  query: string = ''

  constructor() {
    makeAutoObservable(this)
  }

  set_query(q: string) {
    this.query = q
  }

  get_filtered_and_sorted(details: DetailSt[]): DetailSt[] {
    return this.sort_details(this.filter_details_by_query(details))
  }

  private get_query_tokens(): string[] {
    return this.query?.toLowerCase().split(/\s+/).filter(Boolean) ?? []
  }

  private filter_details_by_query(details: DetailSt[]): DetailSt[] {
    const tokens = this.get_query_tokens()

    if (tokens.length === 0) {
      return details
    }

    return details.filter(detail =>
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
}

export class GroupExplorerVM {
  readonly edit_group_modal = new EditGroupVM()
  readonly group_content = new GroupContentVM()
  readonly create_subgroup_modal = new CreateSubGroupVM()

  group: Group | null = null
  details: DetailSt[] = []

  constructor() {
    makeAutoObservable(this)
  }

  get group_tree() {
    return app_cache.groups.tree
  }

  get groups() {
    return app_cache.groups.list()
  }

  open_group(group: Group | null, details: DetailSt[]) {
    this.group = group
    this.details = details
    this.edit_group_modal.set_name(group?.name || '')
  }

  clear() {
    this.group = null
    this.details = []
  }

  /** Gets the full path of group names for a specific group ID. */
  private get_group_path(groupId: number): string[] {
    const path: string[] = []

    const findPath = (nodes: GroupTreeNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === groupId) {
          const buildPath = (n: GroupTreeNode) => {
            if (n.depth > 0) {
              const parent = this.find_parent_node(n, this.group_tree)
              if (parent) buildPath(parent)
            }
            path.push(n.name)
          }
          buildPath(node)
          return true
        }
        if (findPath(node.children)) return true
      }
      return false
    }

    findPath(this.group_tree)
    return path
  }

  group_name(id: number) {
    return this.get_group_path(id).join('/')
  }

  private find_parent_node(
    node: GroupTreeNode,
    nodes: GroupTreeNode[],
  ): GroupTreeNode | null {
    for (const n of nodes) {
      if (n.children.some(c => c.id === node.id)) return n
      const found = this.find_parent_node(node, n.children)
      if (found) return found
    }
    return null
  }
}

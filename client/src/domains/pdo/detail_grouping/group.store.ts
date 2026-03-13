import { makeAutoObservable } from 'mobx'
import type { Color } from 'models'
import { app_cache } from '@/domains/pdo/cache'

class EditGroupModal {
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

class CreateSubGroupModal {
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

export class Detail {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly drawing_number: string | null,
    readonly group_ids: number[] = [],
    public colors?: Color[],
  ) {
    makeAutoObservable(this)
  }

  setColors(colors: Color[]) {
    this.colors = colors
  }
}

export interface GroupWithDetails {
  group: Group
  details: Detail[]
}

export class DetailListStore {
  query: string = ''

  constructor() {
    makeAutoObservable(this)
  }

  set_query(q: string) {
    this.query = q
  }

  getFilteredAndSorted(details: Detail[]): Detail[] {
    return this.sortDetails(this.filterDetailsByQuery(details))
  }

  private getQueryTokens(): string[] {
    return this.query?.toLowerCase().split(/\s+/).filter(Boolean) ?? []
  }

  private filterDetailsByQuery(details: Detail[]): Detail[] {
    const tokens = this.getQueryTokens()

    if (tokens.length === 0) {
      return details
    }

    return details.filter(detail => this.matchesAllTokens(detail.name, tokens))
  }

  private matchesAllTokens(text: string, tokens: string[]): boolean {
    const value = text.toLowerCase()
    return tokens.every(token => value.includes(token))
  }

  private sortDetails(details: Detail[]): Detail[] {
    return details.slice().sort((a, b) =>
      a.name.localeCompare(b.name, 'ru', {
        numeric: true,
        sensitivity: 'base',
      }),
    )
  }
}

export class DetailGroupStore {
  readonly edit_group_modal = new EditGroupModal()
  readonly detail_list = new DetailListStore()
  readonly create_subgroup_modal = new CreateSubGroupModal()

  opened_group: GroupWithDetails | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get group_tree() {
    return app_cache.groups.tree
  }

  get groups() {
    return app_cache.groups.list()
  }

  open_group(group: GroupWithDetails | null) {
    this.opened_group = group
    // this.opened_group?.details.sort((a, b) => a.name.localeCompare(b.name))
    this.edit_group_modal.set_name(group?.group.name || '')
  }

  clear() {
    this.opened_group = null
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

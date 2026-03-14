import { makeAutoObservable } from 'mobx'
import { app_cache } from '../../cache'

export const FullPathSeparator = '/'

export class Node {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly parent_id: number | null,
    readonly children: Node[],
    readonly depth: number,
  ) {
    makeAutoObservable(this)
  }

  has_childrens() {
    return !!this.children.length
  }

  expand_up_to_node(node_id: number) {
    const full_path = app_cache.groups.tree.full_path_for(node_id)
    if (!full_path) return false

    if (full_path.some(node => node.id === this.id)) {
      this.expanded = true
    }
  }

  expanded = false
  toggle_expanded() {
    this.expanded = !this.expanded
  }

  is_expanded(selected_ids: number[] = []) {
    if (!this.children.length) return false

    if (this.check_if_children_selected(this.children, selected_ids)) {
      return true
    }

    return this.expanded
  }

  private check_if_children_selected = (
    nodes: Node[],
    selected_ids: number[] = [],
  ) =>
    nodes.some(
      node =>
        selected_ids.includes(node.id) ||
        this.check_if_children_selected(node.children, selected_ids),
    )
}

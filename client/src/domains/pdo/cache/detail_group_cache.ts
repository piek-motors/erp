import { makeAutoObservable, runInAction } from 'mobx'
import { sort_rus } from 'models'
import { rpc } from '@/lib/rpc/rpc.client'
import type { RouterOutput } from '@/server/lib/trpc'

export type DetailGroupTreeNode =
  RouterOutput['pdo']['detail_groups']['list_tree'][number]

export class DetailGroupCache {
  private group_tree: DetailGroupTreeNode[] = []
  constructor() {
    makeAutoObservable(this)
  }

  private flat_group_tree(nodes: DetailGroupTreeNode[]): DetailGroupTreeNode[] {
    return nodes.flatMap(each => [each, ...this.flat_group_tree(each.children)])
  }

  list() {
    return sort_rus(this.group_tree, a => a.name)
  }

  get tree() {
    return this.group_tree
  }

  get group_id_name_map() {
    return this.flat_group_tree(this.group_tree).reduce(
      (acc, each) => acc.set(each.id, each.name),
      new Map<number, string>(),
    )
  }

  name_for(id: number) {
    return this.group_id_name_map.get(id)
  }

  names_for(ids: number[]) {
    return ids
      .map(id => this.name_for(id))
      .filter((name): name is string => !!name)
  }

  /** Gets the full hierarchical path for a group (e.g., "Parent > Child > Grandchild"). */
  full_path_for(id: number): string | null {
    const find_path = (
      nodes: DetailGroupTreeNode[],
      target_id: number,
      path: string[] = [],
    ): string[] | null => {
      for (const node of nodes) {
        const new_path = [...path, node.name]
        if (node.id === target_id) return new_path
        if (node.children.length > 0) {
          const found = find_path(node.children, target_id, new_path)
          if (found) return found
        }
      }
      return null
    }

    const path = find_path(this.group_tree, id)
    return path ? path.join('/') : null
  }

  async invalidate() {
    const groupTree = await rpc.pdo.detail_groups.list_tree.query()
    runInAction(() => {
      this.group_tree = groupTree
    })
    return groupTree
  }
}

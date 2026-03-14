import { makeAutoObservable, runInAction } from 'mobx'
import { rpc } from '@/lib/rpc/rpc.client'
import type { RouterOutput } from '@/server/lib/trpc'
import { Node } from '../detail_grouping/tree/node_vm'
import { Tree } from '../detail_grouping/tree/tree_vm'

export type DetailGroupTreeNode =
  RouterOutput['pdo']['detail_groups']['list_tree'][number]

export class DetailGroupCache {
  readonly tree = new Tree()
  constructor() {
    makeAutoObservable(this)
  }

  private map_tree_node(raw: DetailGroupTreeNode): Node {
    return new Node(
      raw.id,
      raw.name,
      raw.parent_id,
      raw.children.map(child => this.map_tree_node(child)),
      raw.depth,
    )
  }

  async invalidate() {
    const raw_tree = await rpc.pdo.detail_groups.list_tree.query()
    runInAction(() => {
      this.tree.set_nodes(raw_tree.map(each => this.map_tree_node(each)))
    })
  }
}

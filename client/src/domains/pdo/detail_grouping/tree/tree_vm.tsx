import { makeAutoObservable } from 'mobx'
import { sort_rus } from 'models'
import type { Node } from './node_vm'
import { TreeCache } from './tree_cache_vm'

export class Tree {
  private _nodes: Node[] = []
  cache = new TreeCache()

  constructor() {
    makeAutoObservable(this)
  }

  get nodes() {
    return sort_rus(this._nodes, a => a.name)
  }

  set_nodes(nodes: Node[]) {
    this._nodes = nodes
    this.cache.build(nodes)
  }

  node(id: number) {
    return this.cache.get_node(id)
  }

  full_path_for(id: number): Node[] | null {
    return this.cache.get_full_path(id)
  }

  full_node_name(id: number): string | null {
    return this.cache.get_full_name(id)
  }

  name_for(id: number) {
    return this.cache.get_node(id)?.name
  }

  names_for(ids: number[]) {
    return ids.map(id => this.name_for(id))
  }
}

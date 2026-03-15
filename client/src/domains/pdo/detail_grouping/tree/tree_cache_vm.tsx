import { makeAutoObservable } from 'mobx'
import { FullPathSeparator, type Node } from './node_vm'

export class TreeCache {
  private path_cache = new Map<number, string>()
  private node_cache = new Map<number, Node>()
  private path_nodes_cache = new Map<number, Node[]>()

  constructor() {
    makeAutoObservable(this)
  }

  build(nodes: Node[]) {
    this.path_cache.clear()
    this.node_cache.clear()
    this.path_nodes_cache.clear()
    this.build_recursive(nodes)
  }

  private build_recursive(
    nodes: Node[],
    parent_path = '',
    parent_nodes: Node[] = [],
  ) {
    for (const node of nodes) {
      const path = parent_path
        ? `${parent_path}${FullPathSeparator}${node.name}`
        : node.name
      const path_nodes = [...parent_nodes, node]

      this.path_cache.set(node.id, path)
      this.node_cache.set(node.id, node)
      this.path_nodes_cache.set(node.id, path_nodes)

      if (node.children.length) {
        this.build_recursive(node.children, path, path_nodes)
      }
    }
  }

  get_full_path(id: number): Node[] | null {
    return this.path_nodes_cache.get(id) ?? null
  }

  get_full_name(id: number): string | null {
    return this.path_cache.get(id) ?? null
  }

  get_node(id: number): Node | null {
    return this.node_cache.get(id) ?? null
  }
}

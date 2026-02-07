import { makeAutoObservable } from 'mobx'
import { rpc } from '@/lib/rpc/rpc.client'
import type { RouterOutput } from '@/server/lib/trpc'

export type DetailGroup = RouterOutput['pdo']['detail_groups']['list'][number]

export class DetailGroupCache {
  private groups: DetailGroup[] = []
  getGroups() {
    return this.groups.slice().sort((a, b) =>
      a.name.localeCompare(b.name, 'ru', {
        numeric: true,
        sensitivity: 'base',
      }),
    )
  }
  getGroupName(id?: number | null) {
    if (!id) return null
    return this.groups.find(g => g.id === id)?.name
  }
  constructor() {
    makeAutoObservable(this)
  }
  async load() {
    const groups = await rpc.pdo.detail_groups.list.query()
    this.groups = groups
    return groups
  }
}

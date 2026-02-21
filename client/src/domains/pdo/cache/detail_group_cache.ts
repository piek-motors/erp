import { makeAutoObservable, runInAction } from 'mobx'
import { rpc } from '@/lib/rpc/rpc.client'
import type { RouterOutput } from '@/server/lib/trpc'

export type DetailGroup = RouterOutput['pdo']['detail_groups']['list'][number]

export class DetailGroupCache {
  private groups: DetailGroup[] = []
  constructor() {
    makeAutoObservable(this)
  }

  ls() {
    return this.groups.slice().sort((a, b) =>
      a.name.localeCompare(b.name, 'ru', {
        numeric: true,
        sensitivity: 'base',
      }),
    )
  }

  name_for(id?: number | null) {
    if (!id) return null
    return this.groups.find(g => g.id === id)?.name
  }

  async invalidate() {
    const groups = await rpc.pdo.detail_groups.list.query()
    runInAction(() => {
      this.groups = groups
    })
    return groups
  }
}

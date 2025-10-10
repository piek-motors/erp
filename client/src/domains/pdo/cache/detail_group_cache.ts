import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'

export type DetailGroup = RouterOutput['pdo']['detailGroups']['list'][number]

export class DetailGroupCache {
  private groups: DetailGroup[] = []
  setGroups(groups: DetailGroup[]) {
    this.groups = groups
  }
  getGroups() {
    return this.groups
  }
  getGroupName(id?: number | null) {
    if (!id) return null
    return this.groups.find(g => g.id === id)?.name
  }
  removeGroup(id: number) {
    this.setGroups(this.groups.filter(g => g.id !== id))
  }
  addGroup(group: DetailGroup) {
    this.setGroups([...this.groups, group])
  }
  updateGroup(group: DetailGroup) {
    this.setGroups(this.groups.map(g => (g.id === group.id ? group : g)))
  }
  constructor() {
    makeAutoObservable(this)
  }
  async load() {
    const groups = await rpc.pdo.detailGroups.list.query()
    this.setGroups(groups)
    return groups
  }
}

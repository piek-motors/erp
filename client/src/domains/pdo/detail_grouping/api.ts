import { cache } from 'domains/pdo/cache/root'
import { LoadingController } from 'lib/loading_controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { Detail, DetailGroupStore } from './group.store'

export class DetailGroupingApi {
  readonly groupsLoading = new LoadingController()
  readonly store = new DetailGroupStore()
  readonly targetGroupLoading = new LoadingController()

  constructor() {
    makeAutoObservable(this)
  }

  async loadGroups() {
    return this.groupsLoading.run(async () => {
      await cache.detailGroups.load()
    })
  }

  async loadGroupWithDetails(groupId: number) {
    return this.targetGroupLoading.run(async () => {
      const groupData = await rpc.pdo.detailGroups.get.query({ groupId })
      this.store.setTargetGroup({
        group: groupData.group,
        details: groupData.details.map(d => {
          const detail = new Detail()
          detail.id = d.id
          detail.name = d.name
          detail.part_code = d.part_code
          detail.group_id = d.group_id
          detail.colors = d.colors
          return detail
        })
      })
    })
  }

  async loadAvailableUniversalDetails() {
    return this.groupsLoading.run(async () => {
      const details = await rpc.pdo.details.list.query({
        onlyUniversalDetails: true
      })
      this.store.setAvailableDetails(
        details.map(detail => {
          const d = new Detail()
          d.id = detail[0] as number
          d.name = detail[1] as string
          d.part_code = detail[2] as string
          d.group_id = detail[4] as number | null
          d.colors = []
          return d
        })
      )
    })
  }

  async createGroup(name: string) {
    return this.groupsLoading.run(async () => {
      const newGroup = await rpc.pdo.detailGroups.create.mutate({ name })
      await cache.detailGroups.load()
      return newGroup
    })
  }

  async updateGroup(id: number, name: string) {
    return this.groupsLoading.run(async () => {
      const updatedGroup = await rpc.pdo.detailGroups.update.mutate({
        id,
        name
      })
      await cache.detailGroups.load()
      if (this.store.targetGroup?.group.id === id) {
        await this.loadGroupWithDetails(id)
      }
      return updatedGroup
    })
  }

  async addDetailsToGroup(groupId: number, detailIds: number[]) {
    return this.groupsLoading.run(async () => {
      await rpc.pdo.detailGroups.add_details.mutate({ groupId, detailIds })
      await this.loadGroupWithDetails(groupId)
      this.store.clearSelection()
    })
  }

  async removeDetailsFromGroup(groupId: number, detailIds: number[]) {
    return this.groupsLoading.run(async () => {
      await rpc.pdo.detailGroups.remove_details.mutate({ groupId, detailIds })
      await this.loadGroupWithDetails(groupId)
      this.store.clearSelection()
    })
  }
}

export const crud = new DetailGroupingApi()

import { cache } from 'domains/pdo/cache/root'
import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { DetailGroupStore } from './group.store'

export class DetailGroupingApi {
  readonly groupsLoading = new AsyncStoreController()
  readonly store = new DetailGroupStore()
  readonly targetGroupLoading = new AsyncStoreController()

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
      const groupData = await rpc.metal.detailGroups.get.query({ groupId })
      this.store.setTargetGroup(groupData)
    })
  }

  async loadAvailableUniversalDetails() {
    return this.groupsLoading.run(async () => {
      const details = await rpc.metal.details.list.query({
        onlyUniversalDetails: true
      })
      this.store.setAvailableDetails(
        details.map(detail => ({
          id: detail[0] as number,
          name: detail[1] as string,
          part_code: detail[2] as string,
          group_id: detail[4] as number | null
        }))
      )
    })
  }

  async createGroup(name: string) {
    return this.groupsLoading.run(async () => {
      const newGroup = await rpc.metal.detailGroups.create.mutate({ name })
      await cache.detailGroups.load()
      return newGroup
    })
  }

  async updateGroup(id: number, name: string) {
    return this.groupsLoading.run(async () => {
      const updatedGroup = await rpc.metal.detailGroups.update.mutate({
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
      await rpc.metal.detailGroups.addDetails.mutate({ groupId, detailIds })
      await this.loadGroupWithDetails(groupId)
      this.store.clearSelection()
    })
  }

  async removeDetailsFromGroup(groupId: number, detailIds: number[]) {
    return this.groupsLoading.run(async () => {
      await rpc.metal.detailGroups.removeDetails.mutate({ groupId, detailIds })
      await this.loadGroupWithDetails(groupId)
      this.store.clearSelection()
    })
  }
}

export const crud = new DetailGroupingApi()

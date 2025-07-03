import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { cache } from 'metalflow/metal_flow_cache'
import { makeAutoObservable } from 'mobx'

export interface Group {
  id: number
  name: string
}

export interface Detail {
  id: number
  name: string
  part_code: string | null
  group_id: number | null
}

export interface GroupWithDetails {
  group: Group
  details: Detail[]
}

export class DetailGroupStore {
  readonly async = new AsyncStoreController()

  selectedGroup: GroupWithDetails | null = null
  setSelectedGroup(group: GroupWithDetails | null) {
    this.selectedGroup = group
  }
  availableDetails: Detail[] = []
  setAvailableDetails(details: Detail[]) {
    this.availableDetails = details
  }
  selectedDetailIds: number[] = []
  setSelectedDetailIds(ids: number[]) {
    this.selectedDetailIds = ids
  }
  constructor() {
    makeAutoObservable(this)
  }

  get groups() {
    return cache.detailGroups.getGroups()
  }

  toggleDetailSelection(detailId: number) {
    if (this.selectedDetailIds.includes(detailId)) {
      this.selectedDetailIds = this.selectedDetailIds.filter(
        id => id !== detailId
      )
    } else {
      this.selectedDetailIds = [...this.selectedDetailIds, detailId]
    }
  }

  clearSelection() {
    this.selectedDetailIds = []
  }

  async loadGroups() {
    return this.async.run(async () => {
      await cache.detailGroups.load()
    })
  }

  async loadGroupWithDetails(groupId: number) {
    return this.async.run(async () => {
      const groupData = await rpc.detailGroups.get.query({ groupId })
      this.setSelectedGroup(groupData)
    })
  }

  async loadAvailableDetails() {
    return this.async.run(async () => {
      const details = await rpc.details.list.query()

      this.setAvailableDetails(
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
    return this.async.run(async () => {
      const newGroup = await rpc.detailGroups.create.mutate({ name })
      await cache.detailGroups.load()
      return newGroup
    })
  }

  async updateGroup(id: number, name: string) {
    return this.async.run(async () => {
      const updatedGroup = await rpc.detailGroups.update.mutate({
        id,
        name
      })
      await cache.detailGroups.load()
      if (this.selectedGroup?.group.id === id) {
        await this.loadGroupWithDetails(id)
      }
      return updatedGroup
    })
  }

  async deleteGroup(id: number) {
    return this.async.run(async () => {
      await rpc.detailGroups.delete.mutate({ id })
      cache.detailGroups.removeGroup(id)
      if (this.selectedGroup?.group.id === id) {
        this.setSelectedGroup(null)
      }
    })
  }

  async addDetailsToGroup(groupId: number, detailIds: number[]) {
    return this.async.run(async () => {
      await rpc.detailGroups.addDetails.mutate({ groupId, detailIds })
      await this.loadGroupWithDetails(groupId)
      this.clearSelection()
    })
  }

  async removeDetailsFromGroup(groupId: number, detailIds: number[]) {
    return this.async.run(async () => {
      await rpc.detailGroups.removeDetails.mutate({ groupId, detailIds })
      await this.loadGroupWithDetails(groupId)
    })
  }

  get filteredAvailableDetails() {
    if (!this.selectedGroup) return this.availableDetails

    const groupDetailIds = this.selectedGroup.details.map(d => d.id)
    return this.availableDetails
      .filter(
        // remove details that are already in the group
        detail => !groupDetailIds.includes(detail.id)
        // remove detaild which binded to specific group
      )
      .filter(detail => detail.group_id == null)
  }

  clear() {
    this.selectedGroup = null
    this.availableDetails = []
    this.selectedDetailIds = []
    this.async.reset()
  }
}

export const detailGroupStore = new DetailGroupStore()

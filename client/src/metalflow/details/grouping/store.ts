import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { cache } from 'metalflow/cache/root'
import { makeAutoObservable } from 'mobx'
import { groupNameState } from './group_name.state'

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

  targetGroup: GroupWithDetails | null = null
  setTargetGroup(group: GroupWithDetails | null) {
    this.targetGroup = group
    groupNameState.setName(group?.group.name || '')
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
      const groupData = await rpc.metal.detailGroups.get.query({ groupId })
      this.setTargetGroup(groupData)
    })
  }

  async loadAvailableUniversalDetails() {
    return this.async.run(async () => {
      const details = await rpc.metal.details.list.query({
        onlyUniversalDetails: true
      })
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
      const newGroup = await rpc.metal.detailGroups.create.mutate({ name })
      await cache.detailGroups.load()
      return newGroup
    })
  }

  async updateGroup(id: number, name: string) {
    return this.async.run(async () => {
      const updatedGroup = await rpc.metal.detailGroups.update.mutate({
        id,
        name
      })
      await cache.detailGroups.load()
      if (this.targetGroup?.group.id === id) {
        await this.loadGroupWithDetails(id)
      }
      return updatedGroup
    })
  }

  async addDetailsToGroup(groupId: number, detailIds: number[]) {
    return this.async.run(async () => {
      await rpc.metal.detailGroups.addDetails.mutate({ groupId, detailIds })
      await this.loadGroupWithDetails(groupId)
      this.clearSelection()
    })
  }

  async removeDetailsFromGroup(groupId: number, detailIds: number[]) {
    return this.async.run(async () => {
      await rpc.metal.detailGroups.removeDetails.mutate({ groupId, detailIds })
      await this.loadGroupWithDetails(groupId)
      this.clearSelection()
    })
  }

  get filteredAvailableDetails() {
    if (!this.targetGroup) return this.availableDetails

    const groupDetailIds = this.targetGroup.details.map(d => d.id)
    return this.availableDetails
      .filter(
        // remove details that are already in the group
        detail => !groupDetailIds.includes(detail.id)
        // remove detaild which binded to specific group
      )
      .filter(detail => detail.group_id == null)
  }

  clear() {
    this.targetGroup = null
    this.availableDetails = []
    this.selectedDetailIds = []
    this.async.reset()
  }
}

export const store = new DetailGroupStore()

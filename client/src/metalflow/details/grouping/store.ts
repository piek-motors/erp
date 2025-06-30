import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'

export interface Group {
  id: number
  name: string
}

export interface Detail {
  id: number
  name: string
  part_code: string | null
}

export interface GroupWithDetails {
  group: Group
  details: Detail[]
}

export class DetailGroupStore {
  readonly async = new AsyncStoreController()

  groups: Group[] = []
  selectedGroup: GroupWithDetails | null = null
  availableDetails: Detail[] = []
  selectedDetailIds: number[] = []

  constructor() {
    makeAutoObservable(this)
  }

  setGroups(groups: Group[]) {
    this.groups = groups
  }

  setSelectedGroup(group: GroupWithDetails | null) {
    this.selectedGroup = group
  }

  setAvailableDetails(details: Detail[]) {
    this.availableDetails = details
  }

  setSelectedDetailIds(ids: number[]) {
    this.selectedDetailIds = ids
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
      const groups = await rpc.detailGroups.list.query()
      this.setGroups(groups)
    })
  }

  async loadGroupWithDetails(groupId: number) {
    return this.async.run(async () => {
      const groupData = await rpc.detailGroups.get.query({ id: groupId })
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
          part_code: detail[2] as string
        }))
      )
    })
  }

  async createGroup(name: string) {
    return this.async.run(async () => {
      const newGroup = await rpc.detailGroups.create.mutate({ name })
      await this.loadGroups()
      return newGroup
    })
  }

  async updateGroup(id: number, name: string) {
    return this.async.run(async () => {
      const updatedGroup = await rpc.detailGroups.update.mutate({
        id,
        name
      })
      await this.loadGroups()
      if (this.selectedGroup?.group.id === id) {
        await this.loadGroupWithDetails(id)
      }
      return updatedGroup
    })
  }

  async deleteGroup(id: number) {
    return this.async.run(async () => {
      await rpc.detailGroups.delete.mutate({ id })
      await this.loadGroups()
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
    return this.availableDetails.filter(
      detail => !groupDetailIds.includes(detail.id)
    )
  }

  clear() {
    this.groups = []
    this.selectedGroup = null
    this.availableDetails = []
    this.selectedDetailIds = []
    this.async.reset()
  }
}

export const detailGroupStore = new DetailGroupStore()

import { cache } from 'domains/pdo/cache/root'
import { makeAutoObservable } from 'mobx'
import { GroupNameState } from './group_name.state'

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
  readonly groupNameState = new GroupNameState()
  targetGroup: GroupWithDetails | null = null
  setTargetGroup(group: GroupWithDetails | null) {
    this.targetGroup = group
    this.targetGroup?.details.sort((a, b) => a.name.localeCompare(b.name))
    this.groupNameState.setName(group?.group.name || '')
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
  }
}

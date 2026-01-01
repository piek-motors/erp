import { cache } from 'domains/pdo/cache/root'
import { makeAutoObservable } from 'mobx'
import { Color } from 'models'
import { ColorSegmentation } from './color_segmentation.store'

class GroupNameState {
  constructor() {
    makeAutoObservable(this)
  }
  name: string = ''
  setName(name: string) {
    this.name = name
  }
  modalOpen: boolean = false
  setModalOpen(open: boolean) {
    this.modalOpen = open
  }
}

export interface Group {
  id: number
  name: string
}

export class Detail {
  id!: number
  name!: string
  part_code!: string | null
  group_id!: number | null
  colors?: Color[]
  setColors(colors: Color[]) {
    this.colors = colors
  }
  constructor() {
    makeAutoObservable(this)
  }
}

export interface GroupWithDetails {
  group: Group
  details: Detail[]
}

export class DetailGroupStore {
  readonly groupNameState = new GroupNameState()
  readonly colorSegmentation = new ColorSegmentation()

  targetGroup: GroupWithDetails | null = null
  setTargetGroup(group: GroupWithDetails | null) {
    this.targetGroup = group
    this.targetGroup?.details.sort((a, b) => a.name.localeCompare(b.name))
    this.groupNameState.setName(group?.group.name || '')
    this.colorSegmentation.clear()
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

  get targetGroupDetails() {
    return this.targetGroup?.details.slice().sort((a, b) =>
      a.name.localeCompare(b.name, 'ru', {
        numeric: true,
        sensitivity: 'base'
      })
    )
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

  clear() {
    this.targetGroup = null
    this.selectedDetailIds = []
  }
}

import { DetailList } from './detail/store/detail-list.store'
import { Detail } from './detail/store/detail.store'
import { MaterialListStore } from './material/store/material-list.store'
import { MaterialStore } from './material/store/material.store'

export const detailListStore = new DetailList()
export const detailStore = new Detail()

export const materialListStore = new MaterialListStore()
export const material = new MaterialStore()

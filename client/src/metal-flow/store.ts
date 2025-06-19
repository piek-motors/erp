import { DetailListStore } from './detail/store/detail-list.store'
import { DetailStore } from './detail/store/detail.store'
import { MaterialListStore } from './material/store/material-list.store'
import { MaterialStore } from './material/store/material.store'

export const detailListStore = new DetailListStore()
export const detailStore = new DetailStore()

export const materialListStore = new MaterialListStore()
export const materialStore = new MaterialStore()

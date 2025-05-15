import { DetailListStore } from './detail/detail-list.store'
import { DetailStore } from './detail/detail.store'
import { MaterialListStore } from './material/material-list.store'
import { MaterialStore } from './material/material.store'

export const detailListStore = new DetailListStore()
export const detailStore = new DetailStore()

export const materialListStore = new MaterialListStore()
export const materialStore = new MaterialStore()

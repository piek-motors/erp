import { createContext, useContext } from 'react'
import { MaterialListStore } from './material/material-list.store'
import { MaterialStore } from './material/material.store'

export const materialListStore = new MaterialListStore()
export const materialStore = new MaterialStore()

const MaterialListContext = createContext<MaterialListStore>(materialListStore)
const MaterialContext = createContext<MaterialStore>(materialStore)

export function useMaterialListStore() {
  return useContext(MaterialListContext)
}
export function useMaterialStore() {
  return useContext(MaterialContext)
}

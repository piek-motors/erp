import { formatUnit } from 'shared'
import create from 'zustand'
import { apolloClient } from '../../api'
import {
  GetSuppliesDocument,
  GetSuppliesQuery,
  GetWrietOffsDocument,
  GetWrietOffsQuery
} from '../../types/graphql-shema'
import { Material } from './domain/material'
import { Supply } from './domain/supply'
import { Writeoff } from './domain/writeoff'

interface IStock {
  stock: Map<number, number>
  load(): void
  getRounded(material?: Material): string
  getPrecise(material?: Material): string
  getByIdRounded(materialId: number): string
}

export const useStockStore = create<IStock>(set => ({
  stock: new Map<number, number>(),

  async load() {
    const [suppliesRaw, writeoffsRaw] = await Promise.all([
      apolloClient.query<GetSuppliesQuery>({
        query: GetSuppliesDocument,
        fetchPolicy: 'network-only'
      }),
      apolloClient.query<GetWrietOffsQuery>({
        query: GetWrietOffsDocument,
        fetchPolicy: 'network-only'
      })
    ])

    const supplies = suppliesRaw.data?.metal_pdo_supplies.map(s => {
      const m = s.material
      if (!m) throw Error('Material not found')
      return new Supply(
        s.id,
        new Material(m.id, m.unit, m.shape, m.shape_data),
        s.qty,
        s.supplied_at,
        s.supplier_name
      )
    })

    const writeoffs = writeoffsRaw.data?.metal_pdo_writeoffs.map(w => {
      const m = w.material
      if (!m) throw Error('Material not found')
      return new Writeoff(
        w.id,
        w.date,
        w.qty,
        w.reason,
        new Material(m.id, m.unit, m.shape, m.shape_data),
        w.type,
        w.type_data
      )
    })

    const stock = new Map<number, number>()
    supplies.forEach(s => {
      const qty = stock.get(s.material.id) || 0
      stock.set(s.material.id, qty + s.qty)
    })

    writeoffs.forEach(w => {
      const qty = stock.get(w.material.id) || 0
      stock.set(w.material.id, qty - w.qty)
    })

    set({ stock })
  },

  getRounded(material?: Material): string {
    if (!material) return '-'
    const qty = (this.stock.get(material.id) || 0).toFixed()
    return `${qty} ${formatUnit(material.unitId)}`
  },

  getPrecise(material?: Material): string {
    if (!material) return '-'
    const qty = (this.stock.get(material.id) || 0).toFixed(3)
    return `${qty} ${formatUnit(material.unitId)}`
  },

  getByIdRounded(materialId: number): string {
    if (!materialId) return '-'
    const qty = (this.stock.get(materialId) || 0).toFixed()
    return `${qty} `
  }
}))

import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { Detail, MaterialCost } from '../details/detail.store'

export class DetailCache {
  private details: Detail[] = []
  setDetails(details: Detail[]) {
    this.details = details
  }
  getDetails() {
    return this.details
  }
  removeDetail(id: number) {
    this.setDetails(this.details.filter(d => d.id !== id))
  }
  addDetail(detail: Detail) {
    this.setDetails([...this.details, detail])
  }
  updateDetail(detail: Detail) {
    this.setDetails(this.details.map(d => (d.id === detail.id ? detail : d)))
  }
  constructor() {
    makeAutoObservable(this)
  }
  async load() {
    const details = await rpc.metal.details.list.query()

    this.setDetails(
      details.map(detail => {
        const groupId = detail[4] as number | null
        return new Detail({
          id: detail[0] as number,
          name: detail[1] as string,
          partCode: detail[2] as string,
          groupId,
          usedMaterials: (detail[3] as [number, string, number, number][]).map(
            e => {
              return new MaterialCost({
                materialId: e[0],
                label: e[1],
                length: e[2].toString()
              })
            }
          ),
          stock: detail[5] as number
        })
      })
    )
  }
}

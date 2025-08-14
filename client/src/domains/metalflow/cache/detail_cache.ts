import { matrixDecoder } from 'lib/matrix_decoder'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { ListDetailsOutput } from 'srv/procedures/metalflow/detail/list'
import { Detail } from '../details/store'
import { map } from '../mappers'

export class DetailCache {
  private details: Detail[] = []
  setDetails(details: Detail[]) {
    this.details = details
  }
  get(id: number): Detail | undefined {
    return this.details.find(detail => detail.id === id)
  }
  getLabel(id: number): string {
    const detail = this.get(id)
    return detail ? detail.name : '＼（´Ｏ｀）／'
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
    const detailsRaw = await rpc.metal.details.list.query({})
    const details = matrixDecoder<ListDetailsOutput>(detailsRaw)
    this.setDetails(details.map(each => map.detail.fromDto(each)))
  }
}

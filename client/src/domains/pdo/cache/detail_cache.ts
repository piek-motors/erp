import { matrixDecoder } from 'lib/matrix_decoder'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { ListDetailsOutput } from 'srv/rpc/pdo/detail/list'
import { DetailState } from '../detail/detail.state'
import { map } from '../mappers'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

export class DetailCache {
  private details: DetailState[] = []
  setDetails(details: DetailState[]) {
    this.details = details
  }
  get(id: number): DetailState | undefined {
    return this.details.find(detail => detail.id === id)
  }
  getLabel(id: number): string | null {
    const detail = this.get(id)
    return detail ? capitalize(detail.name) : null
  }
  getDetails() {
    return this.details
  }
  getFirstLetterIndex(): string[] {
    const index = new Set<string>()
    for (const detail of this.details) {
      const firstLetter = detail.name.charAt(0).toUpperCase()
      index.add(firstLetter)
    }

    const arr = Array.from(index).filter(
      letter => letter && alphabet.includes(letter)
    )
    arr.sort()
    return arr
  }
  getUniversalDetails() {
    return this.details.filter(d => d.groupId == null)
  }
  removeDetail(id: number) {
    this.setDetails(this.details.filter(d => d.id !== id))
  }
  addDetail(detail: DetailState) {
    this.setDetails([...this.details, detail])
  }
  updateDetail(detail: DetailState) {
    this.setDetails(this.details.map(d => (d.id === detail.id ? detail : d)))
  }
  constructor() {
    makeAutoObservable(this)
  }
  async load() {
    const detailsRaw = await rpc.pdo.details.list.query()
    const details = matrixDecoder<ListDetailsOutput>(detailsRaw)
    this.setDetails(details.map(each => map.detail.fromDto(each)))
  }
}

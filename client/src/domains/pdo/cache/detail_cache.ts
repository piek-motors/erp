import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { rpc } from 'lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import { ListDetailsOutput } from 'srv/rpc/pdo/details'
import { DetailState } from '../detail/detail.state'
import { map } from '../mappers'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

export class DetailCache {
  private _details: DetailState[] = []
  setDetails(details: DetailState[]) {
    this._details = details
  }
  get(id: number): DetailState | undefined {
    return this._details.find(detail => detail.id === id)
  }
  getLabel(id: number): string | null {
    const detail = this.get(id)
    return detail ? capitalize(detail.name) : null
  }
  get details() {
    return this._details
  }
  getFirstLetterIndex(): string[] {
    const index = new Set<string>()
    for (const detail of this._details) {
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
    return this._details.filter(d => d.groupId == null)
  }
  removeDetail(id: number) {
    this.setDetails(this._details.filter(d => d.id !== id))
  }
  addDetail(detail: DetailState) {
    this.setDetails([...this._details, detail])
  }
  updateDetail(detail: DetailState) {
    this.setDetails(this._details.map(d => (d.id === detail.id ? detail : d)))
  }
  count() {
    return this._details.length
  }

  dictProcessingOperaions: string[] = []
  setDictProcessingOperations(v: string[]) {
    this.dictProcessingOperaions = v
  }

  constructor() {
    makeAutoObservable(this)
  }
  async load() {
    const detailsRaw = await rpc.pdo.details.list.query()
    const details = matrixDecoder<ListDetailsOutput>(detailsRaw)
    this.setDetails(details.map(each => map.detail.fromDto(each)))

    const operationsDict =
      await rpc.pdo.details.dict_processing_operations.query()
    this.setDictProcessingOperations(operationsDict)
  }
}

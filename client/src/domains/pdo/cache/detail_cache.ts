import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { rpc } from 'lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import { ListDetailsOutput } from 'srv/rpc/pdo/details'
import { DetailSt } from '../detail/detail.state'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

type Operation = {
  id: number
  v: string
}

export class DetailCache {
  constructor() {
    makeAutoObservable(this)
  }
  private _details: DetailSt[] = []
  setDetails(details: DetailSt[]) {
    this._details = details
  }
  get(id: number): DetailSt | undefined {
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
  remove(id: number) {
    this.setDetails(this._details.filter(d => d.id !== id))
  }
  addDetail(detail: DetailSt) {
    this.setDetails([...this._details, detail])
  }
  update(detail: DetailSt) {
    this.setDetails(this._details.map(d => (d.id === detail.id ? detail : d)))
  }
  count() {
    return this._details.length
  }

  dictProcessingOperaions: Operation[] = []
  setDictProcessingOperations(v: Operation[]) {
    this.dictProcessingOperaions = v
  }

  async load() {
    const detailsRaw = await rpc.pdo.details.list.query()
    const details = matrixDecoder<ListDetailsOutput>(detailsRaw).map(
      DetailSt.fromDto
    )
    this.setDetails(details)

    const operationsDict = await rpc.pdo.dict.operation_kinds.ls.query()
    this.setDictProcessingOperations(operationsDict)
  }
}

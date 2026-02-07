import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import { makeAutoObservable, runInAction } from 'mobx'
import type { ListDetailsOutput } from 'srv/domains/pdo/details_rpc'
import { DetailSt } from '../detail/detail.state'

const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

type Operation = {
  id: number
  v: string
}

export class DetailCache {
  readonly loader = new LoadingController()

  private _details: DetailSt[] = []

  constructor() {
    makeAutoObservable(this)
  }

  get(id: number): DetailSt | undefined {
    return this._details.find(detail => detail.id === id)
  }

  get details() {
    return this._details
  }

  get first_letter_index(): string[] {
    const index = new Set<string>()
    for (const detail of this._details) {
      const firstLetter = detail.name.charAt(0).toUpperCase()
      index.add(firstLetter)
    }
    const arr = Array.from(index).filter(
      letter => letter && alphabet.includes(letter),
    )
    arr.sort()
    return arr
  }

  get universal_details() {
    return this._details.filter(d => d.group_id == null)
  }

  remove(id: number) {
    this._details = this._details.filter(d => d.id !== id)
  }

  update(detail: DetailSt) {
    this._details = this._details.map(d => (d.id === detail.id ? detail : d))
  }

  count() {
    return this._details.length
  }

  dict_processing_operaions: Operation[] = []
  set_dict_processing_operations(v: Operation[]) {
    this.dict_processing_operaions = v
  }

  async load() {
    this.loader.run(async () => {
      const [detailsRaw, operationsDict] = await Promise.all([
        rpc.pdo.details.list.query(),
        rpc.pdo.dict.operation_kinds.ls.query(),
      ])
      const details = matrixDecoder<ListDetailsOutput>(detailsRaw).map(
        DetailSt.fromDto,
      )
      runInAction(() => {
        this._details = details
        this.dict_processing_operaions = operationsDict
      })
    })
  }
}

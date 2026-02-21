import { makeAutoObservable, runInAction } from 'mobx'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import { normalize } from '@/lib/utils/search'
import type { ListDetailsOutput } from '@/server/domains/pdo/details_rpc'

const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

type Operation = {
  id: number
  v: string
}

export type AppDetail = ListDetailsOutput & { normalized_name: string }

export class DetailCache {
  readonly loader = new LoadingController()
  private _details: AppDetail[] = []

  constructor() {
    makeAutoObservable(this)
  }

  get(id: number): AppDetail | undefined {
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
    return arr.toSorted()
  }

  get universal_details() {
    return this._details.filter(d => d.group_id == null)
  }

  remove(id: number) {
    this._details = this._details.filter(d => d.id !== id)
  }

  update(detail: AppDetail) {
    this._details = this._details.map(d => (d.id === detail.id ? detail : d))
  }

  count() {
    return this._details.length
  }

  dict_processing_operaions: Operation[] = []
  set_dict_processing_operations(v: Operation[]) {
    this.dict_processing_operaions = v
  }

  get_operation_label(id: number) {
    return (
      this.dict_processing_operaions.find(each => each.id === id)?.v ??
      'No value in the dict'
    )
  }

  async invalidate() {
    this.loader.run(async () => {
      const [details_encoded, operations_dict] = await Promise.all([
        rpc.pdo.details.list.query(),
        rpc.pdo.dict.operation_kinds.ls.query(),
      ])
      const details = matrixDecoder<ListDetailsOutput>(details_encoded)

      runInAction(() => {
        this._details = this.normalize_names(details)
        this.dict_processing_operaions = operations_dict
      })
    })
  }

  private normalize_names(d: ListDetailsOutput[]): AppDetail[] {
    return d.map(e => ({
      ...e,
      normalized_name: normalize(e.name),
    }))
  }
}

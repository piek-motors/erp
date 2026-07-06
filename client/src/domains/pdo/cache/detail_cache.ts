import { makeAutoObservable, observable, runInAction } from 'mobx'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import { normalize } from '@/lib/utils/search'
import type { ListDetailsOutput } from '@/server/domains/pdo/details_rpc'
import { GroupAssigment } from '../detail/detail.state'

const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

export type AppDetail = ListDetailsOutput & {
  normalized_name: string
  group_assigment: GroupAssigment
  safe_stock_leftover: number | null
}

type ProcessingOperation = {
  id: number
  v: string
}

export class DetailCache {
  readonly loader = new LoadingController()

  private _detailsMap = observable.map<number, AppDetail>()
  private _operationsMap = observable.map<number, string>()

  constructor() {
    makeAutoObservable(this)
  }

  // O(1) Access
  get(id: number): AppDetail | undefined {
    return this._detailsMap.get(id)
  }

  // Computed array for lists/tables
  get details(): AppDetail[] {
    return Array.from(this._detailsMap.values())
  }

  get first_letter_index(): string[] {
    const index = new Set<string>()
    // Iterating over the map values
    for (const detail of this._detailsMap.values()) {
      const firstLetter = detail.name.charAt(0).toUpperCase()
      if (alphabet.includes(firstLetter)) {
        index.add(firstLetter)
      }
    }
    return Array.from(index).sort()
  }

  remove(id: number) {
    this._detailsMap.delete(id)
  }

  update(detail: AppDetail) {
    this._detailsMap.set(detail.id, detail)
  }

  update_on_hande_balance(detail_id: number, on_hande_balance: number) {
    const detail = this.get(detail_id)
    if (detail) {
      detail.on_hand_balance = on_hande_balance
    }
  }

  count() {
    return this._detailsMap.size
  }

  get_operation_label(id: number) {
    return this._operationsMap.get(id) ?? 'No value in the dict'
  }

  set_dict_processing_operations(operations_dict: ProcessingOperation[]) {
    this._operationsMap.clear()
    operations_dict.forEach(op => {
      this._operationsMap.set(op.id, op.v)
    })
  }

  async invalidate() {
    this.loader.run(async () => {
      const [details_encoded, operations_dict] = await Promise.all([
        rpc.pdo.details.list.query(),
        rpc.pdo.dict.operation_kinds.ls.query(),
      ])

      const details = matrixDecoder<ListDetailsOutput>(details_encoded)
      const normalized = this.normalize_names(details)

      runInAction(() => {
        this._detailsMap.clear()
        normalized.forEach(d => {
          this._detailsMap.set(d.id, d)
        })

        this.set_dict_processing_operations(operations_dict)
      })
    })
  }

  private normalize_names(d: ListDetailsOutput[]): AppDetail[] {
    return d.map(e => ({
      ...e,
      normalized_name: normalize(e.name),
      group_assigment: new GroupAssigment(e.group_ids),
      safe_stock_leftover:
        (e as ListDetailsOutput & { safe_stock_leftover?: number | null })
          .safe_stock_leftover ?? null,
    }))
  }
}

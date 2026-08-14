import { makeAutoObservable } from 'mobx'
import { OperationSubject, uiUnit } from 'shared'
import { rpc } from '@/lib/deps'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { LoadingController } from '@/lib/store/loading_controller'
import { notifier } from '@/lib/store/notifier.store'
import { parseRussianDate } from '@/lib/utils/russian_date'
import { app_cache } from '../cache'
import { detail_columns, material_columns } from './columns'
import type { InventoryLogRecord } from './inventory_log'

class InventoryLogVM {
  readonly loader = new LoadingController()
  operations: InventoryLogRecord[] = []
  dateFrom = ''
  dateTo = ''
  materialId?: number
  detailId?: number
  private requestVersion = 0
  constructor() {
    makeAutoObservable(this)
  }
  setOperations(operations: InventoryLogRecord[]) {
    this.operations = operations
  }

  subject = OperationSubject.Material
  setSubject(v: OperationSubject) {
    this.subject = v
    void this.load(this.materialId, this.detailId).catch(() => {})
  }

  setDateFrom(v: string) {
    this.dateFrom = v
    this.requestVersion += 1
    this.reloadForDateRange()
  }

  setDateTo(v: string) {
    this.dateTo = v
    this.requestVersion += 1
    this.reloadForDateRange()
  }

  private reloadForDateRange() {
    if (!this.isDateRangeValid) return
    void this.load(this.materialId, this.detailId).catch(() => {})
  }

  get isDateRangeValid() {
    const dateFrom = this.dateFrom ? parseRussianDate(this.dateFrom) : undefined
    const dateTo = this.dateTo ? parseRussianDate(this.dateTo, true) : undefined
    return (
      (!this.dateFrom || Boolean(dateFrom)) &&
      (!this.dateTo || Boolean(dateTo)) &&
      !(dateFrom && dateTo && dateFrom > dateTo)
    )
  }

  async load(materialId?: number, detailId?: number) {
    this.materialId = materialId
    this.detailId = detailId
    if (materialId) this.subject = OperationSubject.Material
    if (detailId) this.subject = OperationSubject.Detail

    if (!this.isDateRangeValid) return

    const requestVersion = ++this.requestVersion
    await this.loader.run(async () => {
      const operationsRaw = await rpc.pdo.operations.list.query({
        materialId,
        detailId,
        subject: this.subject,
        dateFrom: parseRussianDate(this.dateFrom),
        dateTo: parseRussianDate(this.dateTo, true),
      })
      const operations = matrixDecoder<InventoryLogRecord>(operationsRaw)
      if (requestVersion === this.requestVersion) {
        this.setOperations(operations)
      }
    })
  }

  async revert(operation: InventoryLogRecord) {
    let object_title: string | undefined
    if (operation.material_id) {
      object_title = app_cache.materials.get(operation.material_id)?.label
    }
    if (operation.detail_id) {
      object_title = app_cache.details.get(operation.detail_id)?.name
    }

    const msg = `Откатить операцию для ${object_title} на ${operation.qty} ${uiUnit(operation.unit)}?`

    if (window.confirm(msg)) {
      const res = await rpc.pdo.operations.revert.mutate({ id: operation.id })
      notifier.warn(res.message)
      await this.load(this.materialId, this.detailId)
    }
  }

  get no_data() {
    return !this.loader.loading && this.operations.length === 0
  }

  get columns() {
    return this.subject === OperationSubject.Material
      ? material_columns
      : detail_columns
  }
}

export const inventory_log_vm = new InventoryLogVM()

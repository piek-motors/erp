import { makeAutoObservable } from 'mobx'
import { OperationSubject, uiUnit } from 'models'
import { rpc } from '@/lib/deps'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { LoadingController } from '@/lib/store/loading_controller'
import { notifier } from '@/lib/store/notifier.store'
import { app_cache } from '../cache'
import { detail_columns, material_columns } from './columns'
import type { InventoryLogRecord } from './inventory_log'

class InventoryLogVM {
  readonly loader = new LoadingController()
  operations: InventoryLogRecord[] = []
  constructor() {
    makeAutoObservable(this)
  }
  setOperations(operations: InventoryLogRecord[]) {
    this.operations = operations
  }

  subject = OperationSubject.Material
  setSubject(v: OperationSubject) {
    this.subject = v
    this.load()
  }

  async load(materialId?: number, detailId?: number) {
    this.loader.run(async () => {
      const operationsRaw = await rpc.pdo.operations.list.query({
        materialId,
        detailId,
        subject: this.subject,
      })
      const operations = matrixDecoder<InventoryLogRecord>(operationsRaw)
      this.setOperations(operations)
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
      await this.load()
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

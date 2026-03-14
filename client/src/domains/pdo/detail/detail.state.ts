import { makeAutoObservable } from 'mobx'
import { Unit } from 'models'
import { AttachmentsStore } from '@/components/attachments/store'
import type { SelectableDetail } from '@/server/domains/pdo/details_rpc'
import type { RouterInput, RouterOutput } from '@/server/lib/trpc'
import { DetailBlankSt } from './detail_blank.store'
import { DetailWarehouseStore } from './warehouse/store'
import { Workflow, WorkflowTask } from './workflow'

type DetailResponse = RouterOutput['pdo']['details']['get']['detail']
type UpdateDetailRequest = RouterInput['pdo']['details']['update']

export type BlankSpec = {
  arr: { key: string; value: any }[]
}

export type DetailStProp = { detail: DetailSt }

export class LastProduction {
  constructor(
    readonly date: Date,
    readonly qty: number,
  ) {}
}

export class GroupAssigment {
  constructor() {
    makeAutoObservable(this)
  }

  group_ids: number[] = []
  set_group_ids(groupIds: number[]) {
    this.group_ids = groupIds
  }

  clear() {
    this.group_ids = []
  }

  on_selection_change(id: number) {
    if (this.group_ids.includes(id)) {
      this.set_group_ids(this.group_ids.filter(gid => gid !== id))
    } else {
      this.set_group_ids([...this.group_ids, id])
    }
  }
}

export class DetailSt {
  readonly attachments = new AttachmentsStore()
  readonly warehouse = new DetailWarehouseStore()
  readonly group_assigment = new GroupAssigment()
  /** metal blank */
  readonly blank = new DetailBlankSt()
  readonly workflow = new Workflow()

  static fromDto(detail: Partial<SelectableDetail>): DetailSt {
    return new DetailSt().init({
      id: detail.id ?? 0,
      name: detail.name ?? '',
      drawing_number: detail.drawing_number ?? null,
      on_hand_balance: detail.on_hand_balance || 0,
      description: detail.description || '',
      drawing_name: detail.drawing_name ?? '',
      updated_at: detail.updated_at?.toString() ?? '',
      recommended_batch_size: detail.recommended_batch_size ?? null,
      workflow: detail.workflow ?? null,
      blank: detail.blank ?? null,
      unit: detail.unit ?? Unit.Countable,
      stock_location: detail.stock_location ?? null,
    })
  }

  id: number = 0
  setId(id: number) {
    this.id = id
  }
  name: string = ''
  setName(name: string) {
    this.name = name
  }
  description: string = ''
  set_description(d: string) {
    this.description = d ?? ''
  }
  drawing_name: string = ''
  set_drawing_name(name: string) {
    this.drawing_name = name
  }
  drawing_number: string = ''
  set_drawing_number(drawingNumber: string) {
    this.drawing_number = drawingNumber
  }
  stock_location: string | null = null
  set_stock_location(v: string) {
    this.stock_location = v
  }
  updated_at: Date | null = null
  set_updated_at(date: Date | null) {
    this.updated_at = date
  }

  last_production: LastProduction | null = null

  recommended_batch_size: number | null = null
  set_recommended_batch_size(size: number | null) {
    this.recommended_batch_size = size
  }

  constructor() {
    makeAutoObservable(this)
  }

  init(d: DetailResponse, group_ids: number[] = []) {
    this.id = d.id!
    this.name = d.name!
    this.drawing_number = d.drawing_number!
    this.group_assigment.group_ids = group_ids
    this.description = d.description || ''
    this.warehouse.setStock(d.on_hand_balance)
    this.updated_at = d.updated_at ? new Date(d.updated_at) : null
    this.workflow.init(
      d.workflow
        ? d.workflow.workflow.map(op => new WorkflowTask(op[0], op[1]))
        : [],
    )
    this.drawing_name = d.drawing_name ?? ''
    if (d.blank) {
      this.blank.init(d.blank)
    }
    this.recommended_batch_size = d.recommended_batch_size ?? null
    this.stock_location = d.stock_location
    return this
  }

  get payload(): UpdateDetailRequest {
    return {
      id: this.id ?? 0,
      description: this.description ?? '',
      name: this.name ?? '',
      drawing_number: this.drawing_number ?? null,
      drawing_name: this.drawing_name ?? null,
      group_ids: this.group_assigment.group_ids,
      recommended_batch_size: Number(this.recommended_batch_size) ?? null,
      workflow: this.workflow ? this.workflow.payload : null,
      blank: this.blank.payload,
      stock_location: this.stock_location || null,
    }
  }
}

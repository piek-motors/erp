import { makeAutoObservable } from 'mobx'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import type {
  CreateDetailClaimRequestInput,
  DetailClaimRequestDetailItem,
  UpdateDetailClaimRequestInput,
} from '@/server/domains/pdo/storage/detail_claim_request_repo'

export interface DetailClaimRequestListItem {
  id: number
  order_id: string
  product_name: string
  product_qty: number
  created_at: string
  sent_to_warehouse_at: string | null
  fulfilled_at: string | null
  detail_count: number
}

export interface DetailClaimRequestFull {
  request: {
    id: number
    order_id: string
    product_name: string
    product_qty: number
    created_at: string
    sent_to_warehouse_at: string | null
    fulfilled_at: string | null
  }
  details: DetailClaimRequestDetailItem[]
}

interface FulfillDetailClaimRequestResult {
  writtenOffQty: number
}

export class DetailRequestApi {
  readonly loader = new LoadingController()

  constructor() {
    makeAutoObservable(this)
  }

  async list(): Promise<DetailClaimRequestListItem[]> {
    return this.loader.run(async () =>
      matrixDecoder<DetailClaimRequestListItem>(
        await rpc.pdo.detail_claim_requests.list.query(),
      ),
    )
  }

  async get(id: number): Promise<DetailClaimRequestFull> {
    return this.loader.run(async () =>
      rpc.pdo.detail_claim_requests.get.query({ id }),
    )
  }

  async create(input: CreateDetailClaimRequestInput) {
    return this.loader.run(async () =>
      rpc.pdo.detail_claim_requests.create.mutate(input),
    )
  }

  async update(input: UpdateDetailClaimRequestInput) {
    return this.loader.run(async () =>
      rpc.pdo.detail_claim_requests.update.mutate(input),
    )
  }

  async sendToWarehouse(id: number) {
    return this.loader.run(async () =>
      rpc.pdo.detail_claim_requests.send_to_warehouse.mutate({ id }),
    )
  }

  async fulfill(id: number): Promise<FulfillDetailClaimRequestResult> {
    return this.loader.run(async () => {
      const result = await rpc.pdo.detail_claim_requests.fulfill.mutate({ id })
      return result as unknown as FulfillDetailClaimRequestResult
    })
  }

  async delete(id: number) {
    return this.loader.run(async () =>
      rpc.pdo.detail_claim_requests.delete.mutate({ id }),
    )
  }
}

export const detail_request_api = new DetailRequestApi()

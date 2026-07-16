import { WriteoffReason } from 'shared'
import { Warehouse } from '#root/domains/pdo/services/warehouse_service.js'
import { type DB, type IDB, RpcError } from '#root/sdk.js'
import { DetailRepo } from './detail_repo.js'

export interface DetailClaimRequestDetailInput {
  detail_id: number
  qty: number
}

export interface CreateDetailClaimRequestInput {
  order_id: string
  product_name: string
  product_qty: number
  details: DetailClaimRequestDetailInput[]
}

export interface UpdateDetailClaimRequestInput
  extends CreateDetailClaimRequestInput {
  id: number
}

export interface DetailClaimRequestListItem {
  id: number
  order_id: string
  product_name: string
  product_qty: number
  created_at: Date
  sent_to_warehouse_at: Date | null
  fulfilled_at: Date | null
  detail_count: number
}

export interface DetailClaimRequestDetailItem {
  detail_id: number
  detail_name: string
  drawing_number: string | null
  group_ids: number[]
  qty: number
  on_hand_balance: number
  stock_location: string | null
}

export interface DetailClaimRequestFull {
  request: DB.Pdo.DetailClaimRequest
  details: DetailClaimRequestDetailItem[]
}

export interface FulfillDetailClaimRequestResult {
  request: DB.Pdo.DetailClaimRequest
  writtenOffQty: number
}

export class DetailClaimRequestRepo {
  private readonly detail_repo: DetailRepo

  constructor(private readonly db: IDB) {
    this.detail_repo = new DetailRepo(db)
  }

  async list(): Promise<DetailClaimRequestListItem[]> {
    const createdAfter = new Date()
    createdAfter.setDate(createdAfter.getDate() - 30)

    const rows = await this.db
      .selectFrom('pdo.detail_claim_request as r')
      .leftJoin(
        'pdo.detail_claim_request_detail as rd',
        'r.id',
        'rd.request_id',
      )
      .select(eb => [
        'r.id',
        'r.order_id',
        'r.product_name',
        'r.product_qty',
        'r.created_at',
        'r.sent_to_warehouse_at',
        'r.fulfilled_at',
        eb.fn.count<number>('rd.detail_id').as('detail_count'),
      ])
      .where('r.created_at', '>=', createdAfter)
      .groupBy([
        'r.id',
        'r.order_id',
        'r.product_name',
        'r.product_qty',
        'r.created_at',
        'r.sent_to_warehouse_at',
        'r.fulfilled_at',
      ])
      .orderBy('r.created_at', 'desc')
      .execute()

    return rows.map(row => ({
      ...row,
      detail_count: Number(row.detail_count),
    }))
  }

  async get(id: number): Promise<DetailClaimRequestFull> {
    const request = await this.db
      .selectFrom('pdo.detail_claim_request')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    if (!request) {
      throw RpcError('NOT_FOUND', `Detail claim request ${id} not found`)
    }

    const requestDetails = await this.db
      .selectFrom('pdo.detail_claim_request_detail')
      .select(['detail_id', 'qty'])
      .where('request_id', '=', id)
      .execute()

    const qtyByDetailId = new Map(
      requestDetails.map(detail => [detail.detail_id, detail.qty]),
    )
    const details = await this.detail_repo.list_details_by_ids(
      requestDetails.map(detail => detail.detail_id),
    )

    return {
      request,
      details: details.map(detail => ({
        detail_id: detail.id,
        detail_name: detail.name,
        drawing_number: detail.drawing_number,
        group_ids: detail.group_ids,
        qty: qtyByDetailId.get(detail.id) || 0,
        on_hand_balance: detail.on_hand_balance,
        stock_location: detail.stock_location,
      })),
    }
  }

  async create(input: CreateDetailClaimRequestInput): Promise<{ id: number }> {
    return this.db.transaction().execute(async trx => {
      const { details, ...requestData } = input
      const request = await trx
        .insertInto('pdo.detail_claim_request')
        .values(requestData)
        .returning('id')
        .executeTakeFirstOrThrow()

      if (details.length > 0) {
        await trx
          .insertInto('pdo.detail_claim_request_detail')
          .values(
            details.map(detail => ({ ...detail, request_id: request.id })),
          )
          .execute()
      }

      return { id: request.id }
    })
  }

  async update(input: UpdateDetailClaimRequestInput): Promise<{ id: number }> {
    return this.db.transaction().execute(async trx => {
      const { id, details, ...requestData } = input
      const result = await trx
        .updateTable('pdo.detail_claim_request')
        .set(requestData)
        .where('id', '=', id)
        .executeTakeFirst()

      if (Number(result.numUpdatedRows) === 0) {
        throw RpcError('NOT_FOUND', `Detail claim request ${id} not found`)
      }

      await trx
        .deleteFrom('pdo.detail_claim_request_detail')
        .where('request_id', '=', id)
        .execute()

      if (details.length > 0) {
        await trx
          .insertInto('pdo.detail_claim_request_detail')
          .values(details.map(detail => ({ ...detail, request_id: id })))
          .execute()
      }

      return { id }
    })
  }

  async sendToWarehouse(id: number): Promise<DB.Pdo.DetailClaimRequest> {
    const request = await this.db
      .updateTable('pdo.detail_claim_request')
      .set({ sent_to_warehouse_at: new Date() })
      .where('id', '=', id)
      .where('sent_to_warehouse_at', 'is', null)
      .where('fulfilled_at', 'is', null)
      .returningAll()
      .executeTakeFirst()

    if (request) return request

    const existing = await this.db
      .selectFrom('pdo.detail_claim_request')
      .select(['id', 'sent_to_warehouse_at', 'fulfilled_at'])
      .where('id', '=', id)
      .executeTakeFirst()
    if (!existing) {
      throw RpcError('NOT_FOUND', `Detail claim request ${id} not found`)
    }

    if (existing.fulfilled_at) {
      throw RpcError('BAD_REQUEST', `Detail claim request ${id} is fulfilled`)
    }

    throw RpcError(
      'BAD_REQUEST',
      `Detail claim request ${id} is already sent to warehouse`,
    )
  }

  async fulfill(
    id: number,
    userId: number,
  ): Promise<FulfillDetailClaimRequestResult> {
    return this.db.transaction().execute(async trx => {
      const request = await trx
        .updateTable('pdo.detail_claim_request')
        .set({ fulfilled_at: new Date() })
        .where('id', '=', id)
        .where('fulfilled_at', 'is', null)
        .returningAll()
        .executeTakeFirst()

      if (!request) {
        const existing = await trx
          .selectFrom('pdo.detail_claim_request')
          .select(['id', 'fulfilled_at'])
          .where('id', '=', id)
          .executeTakeFirst()

        if (!existing) {
          throw RpcError('NOT_FOUND', `Detail claim request ${id} not found`)
        }

        throw RpcError('BAD_REQUEST', `Detail claim request ${id} is fulfilled`)
      }

      const details = await trx
        .selectFrom('pdo.detail_claim_request_detail')
        .select(['detail_id', 'qty'])
        .where('request_id', '=', id)
        .execute()

      const warehouse = new Warehouse(trx, userId)
      let writtenOffQty = 0

      for (const detail of details) {
        await warehouse.writeoffDetails(
          detail.detail_id,
          detail.qty,
          WriteoffReason.ProductionUse,
        )
        writtenOffQty += detail.qty
      }

      return { request, writtenOffQty }
    })
  }

  async delete(id: number): Promise<{ success: true }> {
    return this.db.transaction().execute(async trx => {
      await trx
        .deleteFrom('pdo.detail_claim_request_detail')
        .where('request_id', '=', id)
        .execute()

      const deleted = await trx
        .deleteFrom('pdo.detail_claim_request')
        .where('id', '=', id)
        .returning('id')
        .executeTakeFirst()

      if (!deleted) {
        throw RpcError('NOT_FOUND', `Detail claim request ${id} not found`)
      }

      return { success: true }
    })
  }
}

import { type DB, type IDB, RpcError } from '#root/sdk.js'

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
  fulfilled_at: Date | null
  detail_count: number
}

export interface DetailClaimRequestDetailItem {
  detail_id: number
  detail_name: string
  drawing_number: string | null
  qty: number
  on_hand_balance: number
  stock_location: string | null
}

export interface DetailClaimRequestFull {
  request: DB.Pdo.DetailClaimRequest
  details: DetailClaimRequestDetailItem[]
}

export class DetailClaimRequestRepo {
  constructor(private readonly db: IDB) {}

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

    const details = await this.db
      .selectFrom('pdo.detail_claim_request_detail as rd')
      .innerJoin('pdo.details as d', 'rd.detail_id', 'd.id')
      .select([
        'rd.detail_id',
        'rd.qty',
        'd.name as detail_name',
        'd.drawing_number',
        'd.on_hand_balance',
        'd.stock_location',
      ])
      .where('rd.request_id', '=', id)
      .orderBy('d.name')
      .execute()

    return { request, details }
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

  async fulfill(id: number): Promise<DB.Pdo.DetailClaimRequest> {
    const request = await this.db
      .updateTable('pdo.detail_claim_request')
      .set({ fulfilled_at: new Date() })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()

    if (!request) {
      throw RpcError('NOT_FOUND', `Detail claim request ${id} not found`)
    }

    return request
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

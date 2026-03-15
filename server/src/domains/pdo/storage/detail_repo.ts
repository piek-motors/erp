import { BlankSchema, type DB, DetailWorkFlowSchema } from 'db'
import { type Selectable, sql } from 'kysely'
import { Unit } from 'models'
import { z } from 'zod'
import { type IDB, RpcError } from '#root/sdk.js'
import { create_detail_group_map, type DetailGroupDetailRow } from '../utils.js'

export type SelectableDetail = Selectable<DB.DetailTable>
export type Blank = DB.DetailBlank
export type DetailWorkflow = DB.DetailWorkflow

export interface DetailAttachment {
  detail_id: number
  attachment_id: number
  id: number | null
  filename: string | null
  size: number | null
  key: string | null
  uploaded_at: Date | null
}

export interface DetailWithGroups {
  detail: Selectable<DB.DetailTable>
  group_ids: number[]
  attachments: DetailAttachment[]
  last_manufacturing: { date: Date; qty: number } | null
}

export interface ListDetailsOutput {
  id: number
  name: string
  drawing_number: string | null
  group_ids: number[]
  on_hand_balance: number
}

const DetailSchema = z.object({
  name: z.string().min(3, 'Название должно быть не менее 3 символов'),
  description: z.string().nullable(),
  drawing_number: z.string().nullable(),
  drawing_name: z.string().nullable(),
  group_ids: z.array(z.number()).optional(),
  workflow: DetailWorkFlowSchema.nullable(),
  blank: BlankSchema.nullable(),
  stock_location: z.string().nullable(),
  recommended_batch_size: z.number().nullable(),
})

export type CreateDetailInput = z.infer<typeof DetailSchema>
export type UpdateDetailInput = CreateDetailInput & { id: number }

export class DetailRepo {
  constructor(private readonly db: IDB) {}

  /**
   * Get detail by ID with all related data (groups, attachments, last manufacturing)
   */
  async get_detail_full(id: number): Promise<DetailWithGroups> {
    const [detail, attachments, lastManufacturing, groupDetails] =
      await Promise.all([
        this.get_by_id(id),
        this.get_attachments(id),
        this.get_last_manufacturing(id),
        this.get_group_ids(id),
      ])
    if (!detail) {
      throw new RpcError('NOT_FOUND', `Detail with id=${id} not found`)
    }
    return {
      detail,
      attachments,
      last_manufacturing: lastManufacturing,
      group_ids: groupDetails.map(d => d.group_id),
    }
  }

  /**
   * Get raw detail by ID
   */
  async get_by_id(id: number): Promise<SelectableDetail | undefined> {
    return await this.db
      .selectFrom('pdo.details')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  /**
   * Get detail blank requirements for order processing
   */
  async blank_requirements(id: number): Promise<{
    id: number
    blank: Blank | null
  }> {
    return this.db
      .selectFrom('pdo.details')
      .where('id', '=', id)
      .select(['id', 'blank'])
      .executeTakeFirstOrThrow()
      .catch(() => {
        throw new RpcError('NOT_FOUND', `Detail ${id} not found`)
      })
  }

  /**
   * Get all details for listing
   */
  async list_details(): Promise<ListDetailsOutput[]> {
    const [details, detail_group_associations] = await Promise.all([
      this.db
        .selectFrom('pdo.details as d')
        .select(['d.id', 'd.name', 'd.drawing_number', 'd.on_hand_balance'])
        .orderBy('d.id', 'desc')
        .execute(),
      this.detail_group_associations(),
    ])
    return details.map(d => ({
      ...d,
      group_ids: detail_group_associations.get(d.id) || [],
    }))
  }

  /**
   * Create new detail
   */
  async create(input: CreateDetailInput): Promise<{ id: number }> {
    const { group_ids, ...detailData } = input

    const result = await this.db
      .insertInto('pdo.details')
      .values({
        ...detailData,
        on_hand_balance: 0,
        updated_at: new Date(),
        unit: Unit.Countable,
      })
      .returning('id')
      .executeTakeFirstOrThrow()

    if (group_ids && group_ids.length > 0) {
      await this.set_group_associations(result.id, group_ids)
    }

    return { id: result.id }
  }

  /**
   * Update existing detail
   */
  async update(input: UpdateDetailInput): Promise<{ id: number }> {
    const { group_ids, ...detailData } = input

    await this.db
      .updateTable('pdo.details')
      .set({
        ...detailData,
        updated_at: new Date(),
      })
      .where('id', '=', input.id)
      .execute()

    if (group_ids !== undefined) {
      await this.set_group_associations(input.id, group_ids)
    }

    return { id: input.id }
  }

  /**
   * Delete detail by ID
   */
  async delete(id: number): Promise<void> {
    await this.db.deleteFrom('pdo.details').where('id', '=', id).execute()
  }

  /**
   * Get details filtered by material ID
   */
  async filter_by_material_id(material_id: number): Promise<
    Array<{
      id: number
      name: string
      drawing_number: string | null
      group_ids: number[]
      on_hand_balance: number
      unit: Unit
    }>
  > {
    const [details, detail_group_associations] = await Promise.all([
      this.db
        .selectFrom('pdo.details')
        .where(
          sql<boolean>`(blank->'material'->>'material_id')::int = ${material_id}`,
        )
        .selectAll()
        .execute(),
      this.detail_group_associations(),
    ])
    return details.map(d => ({
      ...d,
      group_ids: detail_group_associations.get(d.id) || [],
    }))
  }

  /**
   * Get details by operation ID (from workflow)
   */
  async filter_by_operation_id(dict_operation_id: number): Promise<
    Array<{
      id: number
      workflow: DetailWorkflow | null
    }>
  > {
    const details = await this.db
      .selectFrom('pdo.details')
      .select(['id', 'workflow'])
      .execute()

    return details.filter(d =>
      d.workflow?.workflow.some(task => task[0] == dict_operation_id),
    )
  }

  /**
   * Increment detail on-hand balance
   */
  async increment_balance(id: number, qty: number): Promise<number> {
    const result = await this.db
      .updateTable('pdo.details')
      .set(eb => ({
        on_hand_balance: eb('on_hand_balance', '+', qty),
      }))
      .where('id', '=', id)
      .returning(['on_hand_balance'])
      .executeTakeFirstOrThrow()

    return result.on_hand_balance
  }

  /**
   * Decrement detail on-hand balance
   */
  async decrement_balance(id: number, qty: number): Promise<number> {
    const result = await this.db
      .selectFrom('pdo.details')
      .select(['on_hand_balance'])
      .where('id', '=', id)
      .executeTakeFirstOrThrow()

    if (result.on_hand_balance < qty) {
      throw new Error(
        `Insufficient stock: detail_id=${id}, available=${result.on_hand_balance}, requested=${qty}`,
      )
    }

    const updated = await this.db
      .updateTable('pdo.details')
      .set(eb => ({
        on_hand_balance: eb('on_hand_balance', '-', qty),
      }))
      .where('id', '=', id)
      .returning(['on_hand_balance'])
      .executeTakeFirstOrThrow()

    return updated.on_hand_balance
  }

  /**
   * Get current on-hand balance
   */
  async get_balance(id: number): Promise<number> {
    const result = await this.db
      .selectFrom('pdo.details')
      .select(['on_hand_balance'])
      .where('id', '=', id)
      .executeTakeFirstOrThrow()

    return result.on_hand_balance
  }

  /**
   * Get all group associations for a detail
   */
  async get_group_ids(detail_id: number): Promise<DetailGroupDetailRow[]> {
    return await this.db
      .selectFrom('pdo.detail_group_details')
      .where('detail_id', '=', detail_id)
      .select(['detail_id', 'group_id'])
      .execute()
  }

  /**
   * Get all detail-group associations
   */
  async get_all_group_details(): Promise<DetailGroupDetailRow[]> {
    return await this.db
      .selectFrom('pdo.detail_group_details')
      .select(['detail_id', 'group_id'])
      .execute()
  }

  async detail_group_associations() {
    const associations = await this.get_all_group_details()
    return create_detail_group_map(associations)
  }
  /**
   * Get attachments for a detail
   */
  async get_attachments(detail_id: number): Promise<DetailAttachment[]> {
    return this.db
      .selectFrom('pdo.detail_attachments')
      .leftJoin('attachments', join => join.onRef('attachment_id', '=', 'id'))
      .where('detail_id', '=', detail_id)
      .select([
        'pdo.detail_attachments.detail_id',
        'pdo.detail_attachments.attachment_id',
        'attachments.id',
        'attachments.filename',
        'attachments.size',
        'attachments.key',
        'attachments.uploaded_at',
      ])
      .execute()
  }

  /**
   * Get last manufacturing order for a detail
   */
  async get_last_manufacturing(
    detail_id: number,
  ): Promise<{ date: Date; qty: number } | null> {
    const lastManufacturing = await this.db
      .selectFrom('pdo.orders')
      .select(['finished_at', 'qty'])
      .where('detail_id', '=', detail_id)
      .where('finished_at', 'is not', null)
      .orderBy('finished_at', 'desc')
      .limit(1)
      .executeTakeFirst()

    return lastManufacturing && lastManufacturing.finished_at
      ? {
          date: lastManufacturing.finished_at,
          qty: lastManufacturing.qty,
        }
      : null
  }

  /**
   * Set group associations for a detail (replaces all existing)
   */
  async set_group_associations(
    detail_id: number,
    group_ids: number[],
  ): Promise<void> {
    await this.db
      .deleteFrom('pdo.detail_group_details')
      .where('detail_id', '=', detail_id)
      .execute()

    if (group_ids.length > 0) {
      await this.db
        .insertInto('pdo.detail_group_details')
        .values(
          group_ids.map(group_id => ({
            group_id,
            detail_id,
          })),
        )
        .execute()
    }
  }
}

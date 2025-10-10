import { IDB } from '#root/deps.js'
import { ApiError } from '#root/lib/api.error.js'
import { Errcode } from '#root/lib/error-code.js'
import type { DB, Selectable } from 'db'

export interface Attachment {
  key: string
  originalname: string
  size: number
}

export class AttachmentService {
  constructor(private readonly db: IDB) {}

  async insertAttachmentMetadata(
    files: Attachment[]
  ): Promise<Selectable<DB.AttachmentTable>[]> {
    if (files.length === 0) {
      throw Error('No files to insert')
    }

    const attachments = await this.db
      .insertInto('attachments')
      .values(
        files.map(file => ({
          key: file.key,
          filename: file.originalname,
          size: file.size,
          uploaded_at: new Date()
        }))
      )
      .returningAll()
      .execute()

    return attachments
  }

  async linkAttachmentsToOrder(
    attachments: Selectable<DB.AttachmentTable>[],
    orderId: number
  ): Promise<void> {
    await this.db
      .insertInto('orders.order_attachments')
      .values(
        attachments.map(attachment => ({
          order_id: orderId,
          attachment_id: attachment.id
        }))
      )
      .execute()
  }

  async linkAttachmentsToDetail(
    attachments: Selectable<DB.AttachmentTable>[],
    detailId: number
  ): Promise<void> {
    await this.db
      .insertInto('metal_flow.detail_attachments')
      .values(
        attachments.map(attachment => ({
          detail_id: detailId,
          attachment_id: attachment.id
        }))
      )
      .execute()
  }

  async uploadAndLinkFiles(
    files: Attachment[],
    orderId?: number,
    detailId?: number
  ): Promise<Selectable<DB.AttachmentTable>[]> {
    if (!orderId && !detailId) {
      throw ApiError.BadRequest(Errcode.MISSING_ORDERID_HEADER)
    }

    // Create attachments
    const attachments = await this.insertAttachmentMetadata(files)

    // Link attachments to order or detail
    if (orderId) {
      await this.linkAttachmentsToOrder(attachments, orderId)
    } else if (detailId) {
      await this.linkAttachmentsToDetail(attachments, detailId)
    }

    return attachments
  }

  async getAttachmentByKey(
    key: string
  ): Promise<Selectable<DB.AttachmentTable> | null> {
    const result = await this.db
      .selectFrom('attachments')
      .selectAll()
      .where('key', '=', key)
      .executeTakeFirst()

    return result || null
  }

  async getOrderAttachments(
    orderId: number
  ): Promise<Selectable<DB.AttachmentTable>[]> {
    return await this.db
      .selectFrom('orders.order_attachments as oa')
      .innerJoin('attachments as a', 'oa.attachment_id', 'a.id')
      .selectAll('a')
      .where('oa.order_id', '=', orderId)
      .execute()
  }

  async getDetailAttachments(
    detailId: number
  ): Promise<Selectable<DB.AttachmentTable>[]> {
    return await this.db
      .selectFrom('metal_flow.detail_attachments as da')
      .innerJoin('attachments as a', 'da.attachment_id', 'a.id')
      .selectAll('a')
      .where('da.detail_id', '=', detailId)
      .execute()
  }
}

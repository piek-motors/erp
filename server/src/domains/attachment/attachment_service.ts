import type { DB, Selectable } from 'db'
import { ApiError } from '#root/lib/api.error.js'
import { Errcode } from '#root/lib/error-code.js'
import type { IDB } from '#root/sdk.js'

export interface Attachment {
  key: string
  originalname: string
  size: number
}

export class AttachmentService {
  constructor(private readonly db: IDB) {}

  insertAttachmentMetadata(
    files: Attachment[],
  ): Promise<Selectable<DB.AttachmentTable>[]> {
    if (files.length === 0) {
      throw Error('No files to insert')
    }
    return this.db
      .insertInto('attachments')
      .values(
        files.map(file => ({
          key: file.key,
          filename: file.originalname,
          size: file.size,
          uploaded_at: new Date(),
        })),
      )
      .returningAll()
      .execute()
  }

  async linkAttachmentsToOrder(
    attachments: Selectable<DB.AttachmentTable>[],
    orderId: number,
  ): Promise<void> {
    await this.db
      .insertInto('orders.order_attachments')
      .values(
        attachments.map(attachment => ({
          order_id: orderId,
          attachment_id: attachment.id,
        })),
      )
      .execute()
  }

  async linkAttachmentsToDetail(
    attachments: Selectable<DB.AttachmentTable>[],
    detailId: number,
  ): Promise<void> {
    await this.db
      .insertInto('pdo.detail_attachments')
      .values(
        attachments.map(attachment => ({
          detail_id: detailId,
          attachment_id: attachment.id,
        })),
      )
      .execute()
  }

  async uploadAndLinkFiles(
    files: Attachment[],
    orderId?: number,
    detailId?: number,
  ): Promise<Selectable<DB.AttachmentTable>[]> {
    if (!orderId && !detailId) {
      throw ApiError.BadRequest(Errcode.MISSING_ORDERID_HEADER)
    }
    const attachments = await this.insertAttachmentMetadata(files)
    if (orderId) {
      await this.linkAttachmentsToOrder(attachments, orderId)
    } else if (detailId) {
      await this.linkAttachmentsToDetail(attachments, detailId)
    }
    return attachments
  }

  get(key: string): Promise<Selectable<DB.AttachmentTable> | undefined> {
    return this.db
      .selectFrom('attachments')
      .selectAll()
      .where('key', '=', key)
      .executeTakeFirst()
  }

  getOrderAttachments(
    orderId: number,
  ): Promise<Selectable<DB.AttachmentTable>[]> {
    return this.db
      .selectFrom('orders.order_attachments as oa')
      .innerJoin('attachments as a', 'oa.attachment_id', 'a.id')
      .selectAll('a')
      .where('oa.order_id', '=', orderId)
      .execute()
  }

  getDetailAttachments(
    detailId: number,
  ): Promise<Selectable<DB.AttachmentTable>[]> {
    return this.db
      .selectFrom('pdo.detail_attachments as da')
      .innerJoin('attachments as a', 'da.attachment_id', 'a.id')
      .selectAll('a')
      .where('da.detail_id', '=', detailId)
      .execute()
  }
}

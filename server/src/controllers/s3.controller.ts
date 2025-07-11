import { config } from '#root/config.js'
import ApiError from '#root/lib/api.error.js'
import { StaticStringKeys } from '#root/lib/error-codes.js'
import { database } from '#root/lib/graphql-client.js'
import { s3 } from '#root/lib/s3.js'
import type { NextFunction, Request, Response } from 'express'

class _S3Controller {
  async uploadBinaryFiles(
    req: Request & { files: any[]; headers: { order_id: string } },
    res: Response,
    next: NextFunction
  ) {
    /**
     * Incoming request must contain a 'orderid'(integer) parameter in request headers.
     * The `Request` object will be populated with a `files` object containing
     * information about the processed file.
     *
     * hasuraUpload method adds file metadata into database using graphql server.
     */
    console.log('REQ, HEADERS', req.headers)
    const detailId = req.headers.detailid as string
    const orderId = req.headers.orderid as string

    console.log('ORDERID', orderId)
    console.log('DETAILID', detailId)

    if (!orderId && !detailId) {
      throw ApiError.BadRequest(StaticStringKeys.MISSING_ORDERID_HEADER)
    }

    try {
      const data = (
        await database.InsertDocsArrayMutation({
          objects: req.files.map(each => ({
            key: each.key,
            filename: each.originalname,
            size: each.size,
            uploaded_at: new Date().toISOString()
          }))
        })
      )?.insert_attachments?.returning

      if (!data) {
        throw Error('Failed to insert attachments')
      }

      if (orderId) {
        await database.InsertOrderAttachemnts({
          attachments: data.map(each => ({
            order_id: parseInt(orderId),
            attachment_id: each.id
          }))
        })
      } else if (detailId) {
        await database.InsertDetailAttachemnts({
          detailAttachments: data.map(each => ({
            detail_id: parseInt(detailId),
            attachment_id: each.id
          }))
        })
      }

      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async getBinaryFile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await s3
        .getObject({
          Bucket: config.S3_BUCKET,
          Key: req.params.key
        })
        .promise()
      const fileName = encodeURI(data.Metadata?.originalname ?? '')
      res.set('Content-Type', data.ContentType)
      res.set('Content-Disposition', `inline;filename*=utf-8''${fileName}`)
      res.send(data.Body)
    } catch (error) {
      next(error)
    }
  }
}

export const S3Controller = new _S3Controller()

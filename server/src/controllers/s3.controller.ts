import type { NextFunction, Request, Response } from 'express'
import { config } from '../config.ts'
import ApiError from '../exceptions/api.error.ts'
import { StaticStringKeys } from '../lib/constants.ts'
import { database } from '../lib/graphql-client.ts'
import S3Service from '../service/s3.service.ts'

class _S3Controller {
  async removeSingleFile(req: Request, res: Response, next: NextFunction) {
    /**
     * Incoming request must contain a 'orderid'(integer) parameter in request headers.
     * The `Request` object will be populated with a `files` object containing
     * information about the processed file.
     *
     * hasuraUpload method adds file metadata into database using graphql server.
     */
    try {
      const key = req.params.key

      const data = await S3Service.deleteObject(key, config.S3_BUCKET).then(
        async s3_responce => {
          // TODO: delete from doc fron junkction table
          return await database.DeleteDocsMutation({ key })
        }
      )

      res.json(data)
    } catch (error) {
      next(error)
    }
  }

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

    const detailId = req.headers.detail_id as string
    const orderId = req.headers.order_id as string

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
      ).insert_attachments.returning

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
      const data = await S3Service.getObject(req.params.key)
      const fileName = encodeURI(data.Metadata.originalname)
      res.set('Content-Type', data.ContentType)
      res.set('Content-Disposition', `inline;filename*=utf-8''${fileName}`)
      res.send(data.Body)
    } catch (error) {
      next(error)
    }
  }
}

export const S3Controller = new _S3Controller()

import { config } from '#root/config.js'
import { s3 } from '#root/ioc/s3.js'
import { AttachmentService } from '#root/service/attachment.js'
import type { NextFunction, Request, Response } from 'express'

export class S3Controller {
  constructor(private readonly attachmentService: AttachmentService) {}

  async uploadBinaryFiles(
    req: Request & { files: any[]; headers: { order_id: string } },
    res: Response,
    next: NextFunction
  ) {
    /**
     * Incoming request must contain a 'orderid'(integer) parameter in request headers.
     * The `Request` object will be populated with a `files` object containing
     * information about the processed file.
     */
    const detailId = req.headers.detailid as string
    const orderId = req.headers.orderid as string
    try {
      const files = req.files.map(file => ({
        key: file.key,
        originalname: file.originalname,
        size: file.size
      }))

      const orderIdNum = orderId ? parseInt(orderId) : undefined
      const detailIdNum = detailId ? parseInt(detailId) : undefined

      const data = await this.attachmentService.uploadAndLinkFiles(
        files,
        orderIdNum,
        detailIdNum
      )
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

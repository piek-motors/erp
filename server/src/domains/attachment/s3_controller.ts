import type { NextFunction, Request, Response } from 'express'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { config } from '#root/config/env.js'
import { attachmentService } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { s3 } from '#root/ioc/s3.js'

export const uploadBinaryFiles = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  /**
   * Incoming request must contain a 'orderid'(integer) parameter in request headers.
   * The `Request` object will be populated with a `files` object containing
   * information about the processed file.
   */
  const reqWithFiles = req as Request & {
    files: any[]
    headers: { order_id: string; detailid: string }
  }

  const detailId = reqWithFiles.headers.detailid as string
  const orderId = reqWithFiles.headers.orderid as string

  ;(async () => {
    try {
      const files = reqWithFiles.files.map(file => ({
        key: file.key,
        originalname: file.originalname,
        size: file.size,
      }))

      const orderIdNum = orderId ? parseInt(orderId, 10) : undefined
      const detailIdNum = detailId ? parseInt(detailId, 10) : undefined
      const data = await attachmentService.uploadAndLinkFiles(
        files,
        orderIdNum,
        detailIdNum,
      )
      res.send(data)
    } catch (error) {
      logger.error(error, 'Error uploading binary files')
      next(error)
    }
  })()
}

export const getBinaryFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const key = req.params.key
  try {
    const data = await s3.send(
      new GetObjectCommand({
        Bucket: config.S3_BUCKET,
        Key: key,
      }),
    )

    // Decode the filename from S3 metadata
    let fileName = data.Metadata?.originalname ?? 'file'
    try {
      fileName = decodeURIComponent(fileName)
    } catch (e) {
      logger.warn({ error: e }, 'Could not decode filename, using as-is')
    }

    // RFC 5987 encoding for Content-Disposition header
    const encodedFileName = encodeURIComponent(fileName)
    res.set('Content-Type', data.ContentType ?? 'application/octet-stream')
    res.set(
      'Content-Disposition',
      `inline; filename*=UTF-8''${encodedFileName}`,
    )

    if (data.Body) {
      const stream = data.Body as any
      stream.pipe(res)
    }
  } catch (error) {
    logger.error(error, `Error getting binary file with key ${key}`)
    next(error)
  }
}

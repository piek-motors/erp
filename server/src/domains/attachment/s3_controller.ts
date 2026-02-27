import type { FastifyRequest, FastifyReply } from 'fastify'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { config } from '#root/config/env.js'
import { attachmentService } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { s3 } from '#root/ioc/s3.js'

export const uploadBinaryFiles = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  /**
   * Incoming request must contain a 'orderid'(integer) parameter in request headers.
   * The `Request` object will be populated with a `files` object containing
   * information about the processed file.
   */
  const reqWithFiles = request as FastifyRequest & {
    files: any[]
    headers: { order_id: string; detailid: string }
  }

  const detailId = reqWithFiles.headers.detailid as string
  const orderId = reqWithFiles.headers.orderid as string

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
    return reply.send(data)
  } catch (error) {
    logger.error(error, 'Error uploading binary files')
    throw error
  }
}

export const getBinaryFile = async (
  request: FastifyRequest<{ Params: { key: string } }>,
  reply: FastifyReply,
) => {
  const key = request.params.key
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
    reply.header('Content-Type', data.ContentType ?? 'application/octet-stream')
    reply.header(
      'Content-Disposition',
      `inline; filename*=UTF-8''${encodedFileName}`,
    )

    if (data.Body) {
      const stream = data.Body as NodeJS.ReadableStream
      // Use reply.send() with the stream instead of manual piping
      // This ensures proper stream lifecycle management
      return reply.send(stream)
    }
  } catch (error) {
    logger.error(error, `Error getting binary file with key ${key}`)
    throw error
  }
}

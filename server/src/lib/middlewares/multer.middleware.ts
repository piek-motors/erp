import { randomUUID } from 'node:crypto'
import type { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import {
  PutObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import { config } from '#root/config/env.js'
import { s3 } from '#root/ioc/s3.js'
import { logger } from '#root/ioc/log.js'

async function uploadToS3(
  file: any,
  bucket: string,
  storageClass: string,
): Promise<{ key: string; bucket: string; originalname: string }> {
  const key = randomUUID()
  // Store original filename as-is for database
  const originalname = file.originalname
  // Encode filename for S3 metadata (RFC 5987)
  const encodedFilename = encodeURIComponent(originalname)

  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    StorageClass: storageClass as any,
    Metadata: {
      originalname: encodedFilename,
    },
  }

  logger.info(
    { bucket, key, contentType: file.mimetype, size: file.size, originalname },
    'Uploading file to S3',
  )
  await s3.send(new PutObjectCommand(params))
  logger.info({ bucket, key }, 'File uploaded successfully')

  return { key, bucket, originalname }
}

const memoryStorage = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 20,
  },
}).array('files', 20)

// Wrap multer middleware to handle S3 upload
export const multerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info('Starting multer S3 upload middleware')
  memoryStorage(req, res, async err => {
    if (err) {
      logger.error(err, 'Multer memory storage error')
      return next(err)
    }

    try {
      const files: any[] = (req as any).files
      logger.info({ fileCount: files?.length }, 'Files received in memory')

      if (files && files.length > 0) {
        for (const file of files) {
          // Fix UTF-8 encoding: multer parses filenames as latin1, convert to UTF-8
          file.originalname = Buffer.from(file.originalname, 'latin1').toString(
            'utf-8',
          )
          logger.info(
            { originalname: file.originalname },
            'Fixed filename encoding',
          )

          const result = await uploadToS3(file, config.S3_BUCKET, 'COLD')
          file.key = result.key
          file.bucket = result.bucket
          file.originalname = result.originalname // Keep original name for database
        }
      }
      next()
    } catch (error) {
      logger.error(error, 'Error uploading to S3')
      next(error)
    }
  })
}

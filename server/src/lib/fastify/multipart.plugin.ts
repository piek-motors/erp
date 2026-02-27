import { randomUUID } from 'node:crypto'
import {
  PutObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { config } from '#root/config/env.js'
import { logger } from '#root/ioc/log.js'
import { s3 } from '#root/ioc/s3.js'

export async function multipartPlugin(fastify: FastifyInstance) {
  await fastify.register(import('@fastify/multipart'), {
    limits: {
      files: 20,
    },
  })
}

export async function handleFileUpload(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const files: any[] = []

    // Get all file parts using request.files() iterator
    for await (const part of request.files()) {
      if (part.file) {
        const chunks: Buffer[] = []
        for await (const chunk of part.file) {
          chunks.push(chunk)
        }
        const buffer = Buffer.concat(chunks)

        // Handle filename encoding: browsers send UTF-8, but multipart may decode as latin1
        // Detect and fix encoding issues (common with Cyrillic, Chinese, etc.)
        let originalname = part.filename
        if (needsEncodingFix(part.filename)) {
          originalname = Buffer.from(part.filename, 'latin1').toString('utf-8')
        }

        const result = await send_to_s3(
          {
            buffer,
            mimetype: part.mimetype,
            originalname,
          },
          config.S3_BUCKET,
          'COLD',
        )

        files.push({
          key: result.key,
          originalname: result.originalname,
          bucket: result.bucket,
          size: buffer.length,
        })
      }
    }

    logger.info({ fileCount: files.length }, 'Files uploaded to S3')
    return files
  } catch (error) {
    logger.error(error, 'Error uploading to S3')
    throw error
  }
}

/**
 * Detects if a string appears to have encoding issues (UTF-8 bytes interpreted as latin1)
 * This happens when Cyrillic, Chinese, or other non-Latin characters are in filenames
 */
function needsEncodingFix(filename: string): boolean {
  // Check for common patterns of mojibake (encoding corruption)
  // UTF-8 Cyrillic characters when misinterpreted as latin1 produce specific byte patterns
  const mojibakePattern = /[\u0080-\u009F\u00A0-\u00FF]/
  return mojibakePattern.test(filename)
}

async function send_to_s3(
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

  await s3.send(new PutObjectCommand(params))
  logger.info({ key }, 'File uploaded successfully')

  return { key, bucket, originalname }
}

import { S3Client } from '@aws-sdk/client-s3'
import { config } from '#root/config/env.js'

export const s3 = new S3Client({
  region: 'auto',
  endpoint: config.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  },
})

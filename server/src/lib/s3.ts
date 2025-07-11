import { config } from '#root/config.js'
import AWS from 'aws-sdk'

export const s3 = new AWS.S3({
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  endpoint: config.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
})

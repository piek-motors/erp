import { randomUUID } from 'node:crypto'
import multer from 'multer'
import multerS3, { AUTO_CONTENT_TYPE } from 'multer-s3'
import { config } from '#root/config/env.js'
import { s3 } from '#root/ioc/s3.js'

const multerMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.S3_BUCKET,
    storageClass: 'COLD',
    contentType: AUTO_CONTENT_TYPE,
    key: (_req, _file, cb) => {
      //generate unique file names to be saved on the server
      cb(null, randomUUID())
    },
  }),
}).array('files', 20)

export default multerMiddleware

import multer from 'multer'
import multerS3, { AUTO_CONTENT_TYPE } from 'multer-s3'
// @ts-ignore
import { randomUUID } from 'node:crypto'
import { config } from '../../config.ts'
import { s3 } from '../../lib/s3-clients.ts'

const multerMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.S3_BUCKET,
    storageClass: 'COLD',
    contentType: AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      //generate unique file names to be saved on the server
      cb(null, randomUUID())
    }
  })
}).array('files', 20)

export default multerMiddleware

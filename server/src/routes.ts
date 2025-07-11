import { UserController } from '#root/controllers/auth.controller.js'
import { Router } from 'express'
import { body } from 'express-validator'
import { S3Controller } from './controllers/s3.controller.js'
import { multerMiddleware } from './lib/index.js'
import { TokenRepository } from './repositories/token.js'
import { AuthSevice } from './service/auth.service.js'
import { TokenService } from './service/token.service.js'

const c = new UserController(
  new AuthSevice(new TokenService(new TokenRepository()))
)

export const router: Router = Router()
  .post('/login', body('email').isEmail(), (req, res, next) => {
    c.login(req as any, res, next)
  })
  .post('/logout', (req, res, next) => {
    c.logout(req, res, next)
  })
  .get('/refresh', (req, res, next) => {
    c.refresh(req, res, next)
  })
  .put('/s3', [multerMiddleware, S3Controller.uploadBinaryFiles])
  .get('/s3/:key', S3Controller.getBinaryFile)

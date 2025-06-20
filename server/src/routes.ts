import { Router } from 'express'
import { body } from 'express-validator'
import { UserController } from './controllers/auth.controller.ts'
import { S3Controller } from './controllers/s3.controller.ts'
import { multerMiddleware } from './lib/index.ts'

export const router: Router = Router()
  .post('/login', body('email').isEmail(), (req, res, next) => {
    UserController.login(req as any, res, next)
  })
  .post('/logout', (req, res, next) => {
    UserController.logout(req, res, next)
  })
  .get('/refresh', (req, res, next) => {
    UserController.refresh(req, res, next)
  })
  .put('/s3', [multerMiddleware, S3Controller.uploadBinaryFiles])
  .get('/s3/:key', S3Controller.getBinaryFile)

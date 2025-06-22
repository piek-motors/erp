import { UserController } from '#root/controllers/auth.controller.js'
import { Router } from 'express'
import { body } from 'express-validator'
import { S3Controller } from './controllers/s3.controller.js'
import { multerMiddleware } from './lib/index.js'

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

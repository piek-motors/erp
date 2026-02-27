import { Router } from 'express'
import { body } from 'express-validator'
import {
  getBinaryFile,
  uploadBinaryFiles,
} from '#root/domains/attachment/s3_controller.js'
import { userController } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { multerMiddleware } from '#root/lib/index.js'

export const router: Router = Router()
  .post('/login', body('email').isEmail(), (req, res, next) => {
    userController.login(req as any, res).catch(err => {
      logger.error(err, 'Login error')
      next(err)
    })
  })
  .post('/logout', (req, res, next) => {
    userController.logout(req, res).catch(err => {
      logger.error(err, 'Logout error')
      next(err)
    })
  })
  .get('/refresh', (req, res, next) => {
    userController.refresh(req, res).catch(err => {
      logger.error(err, 'Refresh error')
      next(err)
    })
  })
  .put('/s3', multerMiddleware, uploadBinaryFiles)
  .get('/s3/:key', getBinaryFile)

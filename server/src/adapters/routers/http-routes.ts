import { Router } from 'express'
import { body } from 'express-validator'
import { userController } from '../../ioc/index.js'
import { log } from '../../ioc/log.js'
import { multerMiddleware } from '../../lib/index.js'
import {
  getBinaryFile,
  uploadBinaryFiles
} from '../controllers/s3.controller.js'

export const router: Router = Router()
  .post('/login', body('email').isEmail(), (req, res, next) => {
    userController.login(req as any, res).catch(err => {
      log.error(err, 'Login error')
      next(err)
    })
  })
  .post('/logout', (req, res, next) => {
    userController.logout(req, res).catch(err => {
      log.error(err, 'Logout error')
      next(err)
    })
  })
  .get('/refresh', (req, res, next) => {
    userController.refresh(req, res).catch(err => {
      log.error(err, 'Refresh error')
      next(err)
    })
  })
  .put('/s3', [multerMiddleware, uploadBinaryFiles])
  .get('/s3/:key', getBinaryFile)

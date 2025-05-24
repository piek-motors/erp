import { Router } from 'express'
import { body } from 'express-validator'
import { UserController } from './controllers/auth.controller.ts'
import { S3Controller } from './controllers/s3.controller.ts'
import authMiddleware from './middlewares/auth.middleware.ts'
import multerMiddleware from './middlewares/multer.middleware.ts'

export const router = Router()
router.post('/login', body('email').isEmail(), (req, res, next) => {
  UserController.login(req, res, next)
})
router.post('/logout', (req, res, next) => {
  UserController.logout(req, res, next)
})
router.get('/refresh', (req, res, next) => {
  UserController.refresh(req, res, next)
})
router.put('/s3', [multerMiddleware, S3Controller.uploadBinaryFiles])
router.get('/s3/:key', S3Controller.getBinaryFile)
router.delete('/s3/:key', authMiddleware, S3Controller.removeSingleFile)

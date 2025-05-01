import { Router } from 'express'
import { body } from 'express-validator'
import { UserController } from './controllers/auth.controller.ts'
import { OrderController } from './controllers/order.controller.ts'
import { S3Controller } from './controllers/s3.controller.ts'
import authMiddleware from './middlewares/auth.middleware.ts'
import multerMiddleware from './middlewares/multer.middleware.ts'

export const router = Router()

router.post('/login', body('email').isEmail(), UserController.login)
router.post('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)

// Yandex Cloud Object Storage

// Upload
router.put('/s3', [multerMiddleware, S3Controller.uploadBinaryFiles])
// GetFile
router.get('/s3/:key', S3Controller.getBinaryFile)
// DeleteFile
router.delete('/s3/:key', authMiddleware, S3Controller.removeSingleFile)

router.get('/orders/unpaid', OrderController.getUnpaidOrders)

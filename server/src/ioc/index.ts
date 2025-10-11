import { AttachmentService } from '#root/service/attachment.service.js'
import { AttendanceReportGenerator } from '#root/service/attendance_report.generator.js'
import { AuthSevice } from '#root/service/auth.service.js'
import { TokenService } from '#root/service/token.service.js'
import { UserController } from '../controllers/auth.controller.js'
import { TokenRepository } from '../repositories/token.js'
import { UserRepository } from '../repositories/user.js'
import { db } from './db.js'

const userRepo = new UserRepository(db)
const tokenRepo = new TokenRepository(userRepo, db)

export const tokenService = new TokenService(tokenRepo)
tokenService.initCron()

const authService = new AuthSevice(tokenService, userRepo)
export const attachmentService = new AttachmentService(db)
export const attendanceReportGenerator = new AttendanceReportGenerator(db)
export const userController = new UserController(authService)

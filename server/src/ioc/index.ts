import { UserController } from '#root/adapters/controllers/auth.controller.js'
import { TokenRepository } from '#root/adapters/repositories/token.js'
import { UserRepository } from '#root/adapters/repositories/user.js'
import { AttachmentService } from '#root/service/attachment.js'
import { AttendanceReportGenerator } from '#root/service/attendance_report_generator.js'
import { AuthSevice } from '#root/service/auth.js'
import { TokenService } from '#root/service/token.js'
import { db } from './db.js'

const userRepo = new UserRepository(db)
const tokenRepo = new TokenRepository(userRepo, db)

export const tokenService = new TokenService(tokenRepo)
const authService = new AuthSevice(tokenService, userRepo)
export const attachmentService = new AttachmentService(db)
export const attendanceReportGenerator = new AttendanceReportGenerator(db)
export const userController = new UserController(authService)

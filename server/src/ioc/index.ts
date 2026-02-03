import { AttachmentService } from '#root/domains/attachment/attachment_service.js'
import { AttendanceEventPairingJob } from '#root/domains/attendance/attendance_event_pairing_job.js'
import { AttendanceReportGenerator } from '#root/domains/attendance/report_generator.js'
import { AuthSevice } from '#root/domains/auth/auth_service.js'
import { TokenService } from '#root/domains/auth/token_service.js'
import { MaterialSpendAggJob } from '#root/domains/pdo/jobs/material_spend_agg_job.js'
import { OutdatedPdoOrdersRemovalJob } from '#root/domains/pdo/jobs/outdated_pdo_orders_removal_job.js'
import { JobsRunner } from '#root/lib/jobs_runner.js'
import type { PeriodAggregator } from '#root/lib/statistic/period_aggregator.js'
import { AuthController } from '../domains/auth/auth_controller.js'
import { TokenRepository } from '../domains/auth/repositories/token_repo.js'
import { UserRepository } from '../domains/auth/repositories/user_repo.js'
import { db } from './db.js'

const userRepo = new UserRepository(db)
const tokenRepo = new TokenRepository(userRepo, db)

export class MaterialStatDataContainer {
	writeoffs: {
		monthly?: PeriodAggregator
		quarterly?: PeriodAggregator
	} = {}
}

export const materials_stat_container = new MaterialStatDataContainer()

export const tokenService = new TokenService(tokenRepo)
tokenService.initCron()

const authService = new AuthSevice(tokenService, userRepo)
export const attachmentService = new AttachmentService(db)
export const attendanceReportGenerator = new AttendanceReportGenerator(db)
export const userController = new AuthController(authService)

new JobsRunner([
	new MaterialSpendAggJob(materials_stat_container),
	new OutdatedPdoOrdersRemovalJob(),
	new AttendanceEventPairingJob(),
]).setup()

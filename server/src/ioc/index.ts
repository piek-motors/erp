import { JobsRunner } from '#root/jobs/jobs_runner.js'
import { MaterialQuarterSpendingsAggregationJob } from '#root/jobs/material_quarter_spendings_aggregation_job.js'
import { OutdatedPdoOrdersRemovalJob } from '#root/jobs/outdated_pdo_orders_removal_job.js'
import type { PeriodAggregator } from '#root/lib/statistic/period_aggregator.js'
import { AttendanceReportGenerator } from '#root/rpc/attendance/report_generator.js'
import { AttachmentService } from '#root/service/attachment.service.js'
import { AuthSevice } from '#root/service/auth.service.js'
import { TokenService } from '#root/service/token.service.js'
import { UserController } from '../controllers/auth.controller.js'
import { TokenRepository } from '../repositories/token.js'
import { UserRepository } from '../repositories/user.js'
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
export const userController = new UserController(authService)


new JobsRunner([
	new MaterialQuarterSpendingsAggregationJob(materials_stat_container),
	new OutdatedPdoOrdersRemovalJob()
]).setup()
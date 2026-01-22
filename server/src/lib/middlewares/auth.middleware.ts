import type { NextFunction, Request, Response } from 'express'
import { tokenService } from '#root/ioc/index.js'
import { ApiError } from '#root/lib/api.error.js'
import { Errcode } from '#root/lib/error-code.js'

export default function (req: Request, res: Response, next: NextFunction) {
	try {
		const authorizationHeader = req.headers.authorization
		if (!authorizationHeader) {
			return next(ApiError.Unauthorized(Errcode.MISSING_AUTH_HEADER))
		}
		const accessToken = authorizationHeader.split(' ')[1]
		if (!accessToken) {
			return next(ApiError.Unauthorized(Errcode.MISSING_AUTH_HEADER))
		}
		const user = tokenService.verifyAccess(accessToken)
		if (!user) {
			return next(ApiError.Unauthorized(Errcode.INVALID_ACCESS_TOKEN))
		}
		next()
	} catch (e) {
		next(ApiError.Unauthorized(Errcode.UNKNOWN_ERROR_TRY_AGAIN))
	}
}

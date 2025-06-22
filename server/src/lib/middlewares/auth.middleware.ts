import ApiError from '#root/lib/api.error.js'
import { StaticStringKeys } from '#root/lib/error-codes.js'
import TokenService from '#root/service/token.service.js'
import type { NextFunction, Request, Response } from 'express'

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(
        ApiError.UnauthorizedError(StaticStringKeys.MISSING_AUTH_HEADER)
      )
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(
        ApiError.UnauthorizedError(StaticStringKeys.MISSING_AUTH_HEADER)
      )
    }

    const userData = TokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(
        ApiError.UnauthorizedError(StaticStringKeys.INVALID_ACCESS_TOKEN)
      )
    }

    next()
  } catch (e) {
    next(ApiError.UnauthorizedError(StaticStringKeys.UNKNOWN_ERROR_TRY_AGAIN))
  }
}

import type { NextFunction, Request, Response } from 'express'
import ApiError from '../exceptions/api.error.ts'
import { StaticStringKeys } from '../lib/constants.ts'
import TokenService from '../service/token.service.ts'

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError(StaticStringKeys.MISSING_AUTH_HEADER))
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnauthorizedError(StaticStringKeys.MISSING_AUTH_HEADER))
    }

    const userData = TokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiError.UnauthorizedError(StaticStringKeys.INVALID_ACCESS_TOKEN))
    }

    next()
  } catch (e) {
    next(ApiError.UnauthorizedError(StaticStringKeys.UNKNOWN_ERROR_TRY_AGAIN))
  }
}

import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '#root/lib/api.error.js'
import { Errcode } from '#root/lib/error-code.js'
import { logger } from '#root/ioc/log.js'

export default function (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        code: err.status,
      },
    })
  }

  logger.error(err, "Unhandled internal err")
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      message: Errcode.UNKNOWN_ERROR_TRY_AGAIN,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
  })
}

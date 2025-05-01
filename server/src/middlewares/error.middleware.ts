import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../exceptions/api.error.ts'
import { StaticStringKeys } from '../lib/constants.ts'

export default function (err: ApiError, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        code: err.status
      }
    })
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      message: StaticStringKeys.UNKNOWN_ERROR_TRY_AGAIN,
      code: StatusCodes.INTERNAL_SERVER_ERROR
    }
  })
}

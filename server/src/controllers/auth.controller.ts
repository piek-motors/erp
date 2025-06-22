import ApiError from '#root/lib/api.error.js'
import { StaticStringKeys } from '#root/lib/error-codes.js'
import AuthService from '#root/service/auth.service.js'
import type { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

class _UserController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)

      if (
        !errors.isEmpty() &&
        errors.array().every(each => (each as any).param == 'email')
      ) {
        throw ApiError.BadRequest(StaticStringKeys.INVALID_EMAIL)
      }

      const userCredentials = await AuthService.login(
        req.body.email,
        req.body.password
      )

      res.cookie('refreshToken', userCredentials.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })

      return res.json(userCredentials)
    } catch (e) {
      console.log(e)
      next(e)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
        throw ApiError.BadRequest(StaticStringKeys.INVALID_REFRESH_TOKEN)
      }

      const userID = await AuthService.logout(refreshToken)

      res.clearCookie('refreshToken')

      return res.json(userID)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies

      if (!refreshToken) {
        throw ApiError.BadRequest(StaticStringKeys.INVALID_REFRESH_TOKEN)
      }

      const userData = await AuthService.refresh(refreshToken)

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })

      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
}

export const UserController = new _UserController()

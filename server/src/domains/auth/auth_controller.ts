import type { FastifyReply, FastifyRequest } from 'fastify'
import type { AuthSevice } from '#root/domains/auth/auth_service.js'
import { ApiError } from '#root/lib/api.error.js'
import { Day } from '#root/lib/constants.js'
import { Errcode } from '#root/lib/error-code.js'

export class AuthController {
  private tokenCookieKey = 'refreshToken'
  constructor(private readonly authService: AuthSevice) {}

  async login(
    req: FastifyRequest<{ Body: { email: string; password: string } }>,
    res: FastifyReply,
  ) {
    const email = this.validateEmail(req)
    const password = req.body.password
    if (!password) {
      throw ApiError.BadRequest(Errcode.INVALID_PASSWORD)
    }
    const { refreshToken, accessToken, user } = await this.authService.login(
      email,
      password,
    )
    this.setRefreshTokenCookie(res, refreshToken)
    return res.send({
      user,
      accessToken,
    })
  }

  async logout(req: FastifyRequest, res: FastifyReply) {
    const refreshToken = (req.cookies as any)?.refreshToken
    if (!refreshToken) {
      throw ApiError.BadRequest(Errcode.INVALID_REFRESH_TOKEN)
    }
    const userID = await this.authService.logout(refreshToken)
    res.clearCookie(this.tokenCookieKey)
    return res.send(userID)
  }

  async refresh(req: FastifyRequest, res: FastifyReply) {
    const { refreshToken } = req.cookies as any
    if (!refreshToken) {
      throw ApiError.BadRequest(Errcode.INVALID_REFRESH_TOKEN)
    }
    const userData = await this.authService.refresh(refreshToken)
    this.setRefreshTokenCookie(res, userData.refreshToken)
    return res.send({
      user: userData.user,
      accessToken: userData.accessToken,
    })
  }

  private setRefreshTokenCookie(res: FastifyReply, refreshToken: string) {
    res.setCookie(this.tokenCookieKey, refreshToken, {
      maxAge: 7 * Day,
      httpOnly: true,
    })
  }

  private validateEmail(
    req: FastifyRequest<{ Body: { email: string } }>,
  ): string {
    const email: string = req.body.email
    if (!email) {
      throw ApiError.BadRequest(Errcode.INVALID_EMAIL)
    }
    if (typeof email !== 'string' || email.length < 3 || email.length > 255) {
      throw ApiError.BadRequest(Errcode.INVALID_EMAIL)
    }
    return email.trim()
  }
}

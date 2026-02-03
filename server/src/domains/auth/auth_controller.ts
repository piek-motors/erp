import { AuthSevice } from '#root/domains/auth/auth_service.js'
import { ApiError } from '#root/lib/api.error.js'
import { Day } from '#root/lib/constants.js'
import { Errcode } from '#root/lib/error-code.js'
import type { Request, Response } from 'express'

export class AuthController {
	private tokenCookieKey = 'refreshToken'
	constructor(private readonly authService: AuthSevice) {}

	async login(req: Request, res: Response) {
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
		return res.json({
			user,
			accessToken,
		})
	}

	async logout(req: Request, res: Response) {
		const refreshToken = req.cookies.refreshToken
		if (!refreshToken) {
			throw ApiError.BadRequest(Errcode.INVALID_REFRESH_TOKEN)
		}
		const userID = await this.authService.logout(refreshToken)
		res.clearCookie(this.tokenCookieKey)
		return res.json(userID)
	}

	async refresh(req: Request, res: Response) {
		const { refreshToken } = req.cookies
		if (!refreshToken) {
			throw ApiError.BadRequest(Errcode.INVALID_REFRESH_TOKEN)
		}
		const userData = await this.authService.refresh(refreshToken)
		this.setRefreshTokenCookie(res, userData.refreshToken)
		return res.json({
			user: userData.user,
			accessToken: userData.accessToken,
		})
	}

	private setRefreshTokenCookie(res: Response, refreshToken: string) {
		res.cookie(this.tokenCookieKey, refreshToken, {
			maxAge: 7 * Day,
			httpOnly: true,
		})
	}

	private validateEmail(req: Request) {
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

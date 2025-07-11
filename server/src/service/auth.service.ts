import { db } from '#root/deps.js'
import ApiError from '../lib/api.error.js'
import { StaticStringKeys } from '../lib/error-codes.js'
import { TokenService } from './token.service.js'

export class AuthSevice {
  constructor(private readonly tokenService: TokenService) {}

  async login(email: string, password: string) {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .where('is_deleted', '=', false)
      .executeTakeFirst()

    if (!user) {
      throw ApiError.UnauthorizedError(StaticStringKeys.INVALID_CREDENTIAL)
    } else if (password !== user.password) {
      throw ApiError.UnauthorizedError(StaticStringKeys.INVALID_CREDENTIAL)
    }
    const tokenPayload = this.createTokenPayload(user)
    const tokens = this.tokenService.generateTokens(tokenPayload)
    await this.tokenService.insertToken(user.id, tokens.refreshToken)
    return {
      ...tokens,
      user: tokenPayload
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.deleteToken(refreshToken)
  }

  async refresh(refreshToken: string) {
    if (!this.tokenService.verifyRefresh(refreshToken)) {
      throw ApiError.UnauthorizedError(StaticStringKeys.INVALID_REFRESH_TOKEN)
    }
    const token = await this.tokenService.findToken(refreshToken)
    if (!token) {
      throw ApiError.UnauthorizedError(StaticStringKeys.INVALID_REFRESH_TOKEN)
    }
    const tokenPayload = this.createTokenPayload(token.user)
    const newTokens = this.tokenService.generateTokens(tokenPayload)
    await Promise.all([
      this.tokenService.deleteOutdatedTokens(token.user.id, 30),
      this.tokenService.insertToken(token.user.id, newTokens.refreshToken)
    ])
    return { ...newTokens, user: tokenPayload }
  }

  createTokenPayload(o: {
    id: number
    first_name: string | null
    last_name: string | null
    email: string | null
    role: string
  }) {
    return {
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['admin'],
        'x-hasura-default-role': 'admin'
      },
      id: o.id,
      first_name: o.first_name,
      last_name: o.last_name,
      email: o.email,
      role: o.role
    }
  }
}

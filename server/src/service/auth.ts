import { UserRepository } from '#root/adapters/repositories/user.js'
import { log } from '#root/ioc/log.js'
import { safe } from 'safe-wrapper'
import { ApiError } from '../lib/api.error.js'
import { Errcode } from '../lib/error-code.js'
import { TokenService } from './token.js'

export class AuthSevice {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepository
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email)
    if (password !== user.password) {
      throw ApiError.Unauthorized(Errcode.INVALID_CREDENTIAL)
    }

    const tokenPayload = this.createTokenPayload(user)
    const tokens = this.tokenService.generateTokenPair(tokenPayload)
    await this.tokenService.insert(user.id, tokens.refreshToken)
    log.info(`login ${user.id} ${user.first_name} ${user.last_name}`)
    return {
      ...tokens,
      user: tokenPayload
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revoke(refreshToken)
  }

  async refresh(refreshToken: string) {
    await this.verifyRefresh(refreshToken)

    const token = await this.tokenService.find(refreshToken)
    const tokenPayload = this.createTokenPayload(token.user)
    const newTokenPair = this.tokenService.generateTokenPair(tokenPayload)

    await Promise.all([
      this.tokenService.deleteOutdatedTokens(token.user.id, 30),
      this.tokenService.insert(token.user.id, newTokenPair.refreshToken)
    ])
    log.info(
      `auth ${token.user.id} ${token.user.first_name} ${token.user.last_name}`
    )
    return { ...newTokenPair, user: tokenPayload }
  }

  async verifyRefresh(refreshToken: string) {
    const [error] = safe(() => this.tokenService.verifyRefresh(refreshToken))()
    if (error) {
      throw ApiError.Unauthorized(Errcode.INVALID_REFRESH_TOKEN)
    }
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

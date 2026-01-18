import { logger } from '#root/ioc/log.js'
import { UserRole } from 'models'
import { safe } from 'safe-wrapper'
import { ApiError } from '../lib/api.error.js'
import { Errcode } from '../lib/error-code.js'
import { UserRepository } from '../repositories/user.js'
import { TokenPayload, TokenService } from './token.service.js'

export class AuthSevice {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepository
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.getByEmail(email)
    if (password !== user.password) {
      throw ApiError.Unauthorized(Errcode.INVALID_CREDENTIAL)
    }
    const tokenPayload = this.createTokenPayload(user)
    const tokens = this.tokenService.generateTokenPair(tokenPayload)
    await this.tokenService.insert(user.id, tokens.refreshToken)
    logger.info(`login ${user.id} ${user.first_name} ${user.last_name}`)
    return {
      ...tokens,
      user: tokenPayload
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revoke(refreshToken)
  }

  async refresh(refreshToken: string) {
    this.verifyRefresh(refreshToken)

    const token = await this.tokenService.find(refreshToken)
    const tokenPayload = this.createTokenPayload(token.user)
    const newTokenPair = this.tokenService.generateTokenPair(tokenPayload)
    await this.tokenService.update(refreshToken, newTokenPair.refreshToken)
    logger.info(`auth ${token.user.first_name} ${token.user.last_name}`)
    return { ...newTokenPair, user: tokenPayload }
  }

  verifyRefresh(refreshToken: string) {
    const [error] = safe(() => this.tokenService.verifyRefresh(refreshToken))()
    if (error) {
      throw ApiError.Unauthorized(Errcode.INVALID_REFRESH_TOKEN)
    }
  }

  private createTokenPayload(user: {
    id: number
    first_name: string
    last_name: string
    roles: UserRole[]
  }): TokenPayload {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      roles: user.roles
    }
  }
}

import { log } from '#root/ioc/log.js'
import { Day } from '#root/lib/constants.js'
import jwt from 'jsonwebtoken'
import { config } from '../env.js'
import { TokenRepository } from '../repositories/token.js'

export class TokenService {
  constructor(private readonly tokenRepo: TokenRepository) {}

  initCron() {
    this.revokeOutdatedTokens()
    setInterval(() => {
      this.revokeOutdatedTokens()
    }, Day)
  }

  generateTokenPair(payload: any) {
    return {
      accessToken: jwt.sign(payload, this.secret('access'), {
        expiresIn: config.JWT_ACCESS_SECRET_EXPIRES
      }),
      refreshToken: jwt.sign(payload, this.secret('refresh'), {
        expiresIn: config.JWT_REFRESH_SECRET_EXPIRES
      })
    }
  }
  verifyAccess(token: string) {
    return jwt.verify(token, this.secret('access')) as { id: number }
  }
  verifyRefresh(token: string) {
    return jwt.verify(token, this.secret('refresh'))
  }
  async find(refreshToken: string) {
    return this.tokenRepo.find(refreshToken)
  }
  async update(oldToken: string, newToken: string) {
    return this.tokenRepo.update(oldToken, newToken)
  }
  async insert(userId: number, token: string) {
    return this.tokenRepo.insert(userId, token)
  }
  async revoke(token: string) {
    return this.tokenRepo.delete(token)
  }
  async revokeOutdatedTokens(): Promise<void> {
    try {
      log.info('Deleting outdated tokens')
      const tokens = await this.tokenRepo.getOutdatedTokens()
      const deleted = await this.tokenRepo.deleteTokens(tokens)
      log.info(`Deleted ${deleted.length} outdated tokens`)
    } catch (e) {
      throw Error(`Failed to delete outdated tokens: ${e}`)
    }
  }
  private secret(type: 'access' | 'refresh') {
    return type === 'access'
      ? config.JWT_ACCESS_SECRET
      : config.JWT_REFRESH_SECRET
  }
}

import { Day } from '#root/lib/constants.js'
import jwt from 'jsonwebtoken'
import { UserRole } from 'models'
import { config } from '../config/env.js'
import { TokenRepository } from '../repositories/token.js'

export interface TokenPayload {
  id: number
  first_name: string
  last_name: string
  roles: UserRole[]
}

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

  verifyAccess(token: string): TokenPayload {
    return jwt.verify(token, this.secret('access')) as TokenPayload
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
      const tokens = await this.tokenRepo.getOutdatedTokens()
      if (tokens.length === 0) {
        return
      }
      await this.tokenRepo.deleteTokens(tokens)
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

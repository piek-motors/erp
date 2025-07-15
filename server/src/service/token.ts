import jwt from 'jsonwebtoken'
import { TokenRepository } from '../adapters/repositories/token.js'
import { config } from '../config.js'

export class TokenService {
  constructor(private readonly tokenRepo: TokenRepository) {}
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
    return await this.tokenRepo.find(refreshToken)
  }
  async insert(userId: number, token: string) {
    return await this.tokenRepo.insert(userId, token)
  }
  async revoke(token: string) {
    return await this.tokenRepo.delete(token)
  }
  async deleteOutdatedTokens(userId: number, maxAgeInDays: number) {
    return await this.tokenRepo.deleteOutdatedTokens(userId, maxAgeInDays)
  }

  private secret(type: 'access' | 'refresh') {
    return type === 'access'
      ? config.JWT_ACCESS_SECRET
      : config.JWT_REFRESH_SECRET
  }
}

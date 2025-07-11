import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { TokenRepository } from '../repositories/token.js'

export class TokenService {
  constructor(private readonly tokenRepository: TokenRepository) {}
  generateTokens(payload: any) {
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_SECRET_EXPIRES
    })
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_SECRET_EXPIRES
    })
    return {
      accessToken,
      refreshToken
    }
  }
  verifyAccess(token: string) {
    return jwt.verify(token, config.JWT_ACCESS_SECRET)
  }
  verifyRefresh(token: string) {
    return jwt.verify(token, config.JWT_REFRESH_SECRET)
  }
  async findToken(refreshToken: string) {
    return await this.tokenRepository.find(refreshToken)
  }
  async insertToken(userId: number, token: string) {
    return await this.tokenRepository.insert(userId, token)
  }
  async deleteToken(token: string) {
    return await this.tokenRepository.delete(token)
  }
  async deleteOutdatedTokens(userId: number, maxAgeInDays: number) {
    return await this.tokenRepository.deleteOutdatedTokens(userId, maxAgeInDays)
  }
}
export const tokenService = new TokenService(new TokenRepository())

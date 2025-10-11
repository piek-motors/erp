import { IDB } from '#root/deps.js'
import { ApiError } from '#root/lib/api.error.js'
import { Errcode } from '#root/lib/error-code.js'
import { UserRepository } from './user.js'

export class TokenRepository {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly db: IDB
  ) {}

  async find(refreshToken: string) {
    const token = await this.db
      .selectFrom('refresh_tokens')
      .selectAll()
      .where('token', '=', refreshToken)
      .executeTakeFirst()
    if (!token) {
      throw ApiError.Unauthorized(Errcode.INVALID_REFRESH_TOKEN)
    }
    const user = await this.userRepo.find(token.user_id)
    return {
      token,
      user
    }
  }

  async update(oldToken: string, newToken: string) {
    return this.db
      .updateTable('refresh_tokens')
      .set({ token: newToken, created_at: new Date() })
      .where('token', '=', oldToken)
      .returning('id')
      .executeTakeFirst()
  }

  async insert(user_id: number, token: string) {
    return this.db
      .insertInto('refresh_tokens')
      .values({
        user_id,
        token: token
      })
      .returning(['id', 'created_at'])
      .executeTakeFirst()
  }

  async delete(token: string) {
    return this.db
      .deleteFrom('refresh_tokens')
      .where('token', '=', token)
      .returning('id')
      .executeTakeFirst()
  }

  async deleteOutdatedTokens(userId: number, maxAgeInDays: number) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - maxAgeInDays)
    return this.db
      .deleteFrom('refresh_tokens')
      .where('user_id', '=', userId)
      .where('created_at', '<', cutoffDate)
      .returning(['id'])
      .execute()
  }
}

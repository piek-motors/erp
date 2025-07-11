import { db } from '#root/deps.js'

export class TokenRepository {
  async find(refreshToken: string) {
    const token = await db
      .selectFrom('refresh_tokens')
      .selectAll()
      .where('token', '=', refreshToken)
      .executeTakeFirst()
    if (!token) {
      throw new Error('Token not found')
    }
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', token.user_id)
      .where('is_deleted', '=', false)
      .executeTakeFirst()
    if (!user) {
      throw new Error('User not found')
    }
    return {
      token,
      user
    }
  }

  async insert(user_id: number, token: string) {
    const result = await db
      .insertInto('refresh_tokens')
      .values({
        user_id,
        token: token
      })
      .returning(['id', 'created_at'])
      .executeTakeFirst()

    return result
  }

  async delete(token: string) {
    const result = await db
      .deleteFrom('refresh_tokens')
      .where('token', '=', token)
      .returning('id')
      .execute()

    return result
  }

  async deleteOutdatedTokens(userId: number, maxAgeInDays: number) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - maxAgeInDays)
    return await db
      .deleteFrom('refresh_tokens')
      .where('user_id', '=', userId)
      .where('created_at', '<', cutoffDate)
      .returning(['id'])
      .execute()
  }
}

import { IDB } from '#root/deps.js'
import { ApiError } from '#root/lib/api.error.js'
import { Errcode } from '#root/lib/error-code.js'

export class UserRepository {
  constructor(private readonly db: IDB) {}

  async get(id: number) {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .where('is_deleted', '=', false)
      .executeTakeFirst()
    if (!user) {
      throw ApiError.Unauthorized(Errcode.USER_NOT_FOUND)
    }
    return user
  }

  async getByEmail(email: string) {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .where('is_deleted', '=', false)
      .executeTakeFirst()
    if (!user) {
      throw ApiError.Unauthorized(Errcode.USER_NOT_FOUND)
    }
    return user
  }
}

import ApiError from '../exceptions/api.error.ts'
import { StaticStringKeys } from '../lib/constants.ts'
import { database } from '../lib/graphql-client.ts'
import tokenService from './token.service.ts'

class AuthService {
  formPayload(o) {
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

  async login(email: string, password: string) {
    const users = (await database.AllUsersQuery()).users
    const user = users.find(el => el.email === email)

    if (!user) {
      throw ApiError.UnauthorizedError(StaticStringKeys.INVALID_CREDENTIAL)
    } else if (password !== user.password) {
      throw ApiError.UnauthorizedError(StaticStringKeys.INVALID_CREDENTIAL)
    }
    ///нужно проверить есть ли просроченные токены у этого юзера
    const tokens = tokenService.generateTokens(this.formPayload(user))

    const userCredentials = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    }
    await database.InsertTokenMutation({
      token: tokens.refreshToken,
      user_id: user.id
    })
    return { ...tokens, user: userCredentials }
  }

  async logout(refreshToken: string): Promise<void> {
    await database.DeleteTokenMutation({ token: refreshToken })
  }

  async refresh(refreshToken: string) {
    if (!tokenService.validateRefreshToken(refreshToken)) {
      throw ApiError.UnauthorizedError(StaticStringKeys.INVALID_REFRESH_TOKEN)
    }

    const tokenFromDb = await tokenService.findToken(refreshToken)

    if (!tokenFromDb) {
      throw ApiError.UnauthorizedError('sdf')
    }

    const user = this.formPayload(tokenFromDb.user)

    const newTokens = tokenService.generateTokens(user)

    await database.UpdateTokenMutation({
      token: newTokens.refreshToken,
      token_id: tokenFromDb.id
    })

    return { ...newTokens, user }
  }
}

export default new AuthService()

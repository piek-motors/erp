import { config, type IDB } from '#root/deps.js'
import { ApiError } from '#root/lib/api.error.js'
import { Day } from '#root/lib/constants.js'
import { Errcode } from '#root/lib/error-code.js'
import type { UserRepository } from './user.js'

export class TokenRepository {
	constructor(
		private readonly userRepo: UserRepository,
		private readonly db: IDB,
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
		const user = await this.userRepo.get(token.user_id)
		return {
			token,
			user,
		}
	}

	update(oldToken: string, newToken: string) {
		return this.db
			.updateTable('refresh_tokens')
			.set({ token: newToken, created_at: new Date() })
			.where('token', '=', oldToken)
			.returning('id')
			.executeTakeFirst()
	}

	insert(user_id: number, token: string) {
		return this.db
			.insertInto('refresh_tokens')
			.values({
				user_id,
				token: token,
				created_at: new Date(),
			})
			.returning(['id', 'created_at'])
			.executeTakeFirst()
	}

	delete(token: string) {
		return this.db
			.deleteFrom('refresh_tokens')
			.where('token', '=', token)
			.returning('id')
			.executeTakeFirst()
	}

	getOutdatedTokens() {
		const tokenMaxAgeInMs =
			parseInt(config.JWT_REFRESH_SECRET_EXPIRES, 10) * Day
		const cutoffDate = new Date(Date.now() - tokenMaxAgeInMs)
		return this.db
			.selectFrom('refresh_tokens')
			.select('id')
			.where(qb =>
				qb.or([
					qb('created_at', '<', cutoffDate),
					qb('created_at', 'is', null),
				]),
			)
			.execute()
			.then(res => res.map(r => r.id))
	}

	deleteTokens(ids: number[]) {
		return this.db.deleteFrom('refresh_tokens').where('id', 'in', ids).execute()
	}
}

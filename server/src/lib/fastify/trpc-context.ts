import { TRPCError } from '@trpc/server'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import type { UserRole } from 'models'
import { tokenService } from '#root/ioc/index.js'

export async function createContext({ req }: CreateFastifyContextOptions) {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        return null
      }

      return tokenService.verifyAccess(token)
    }

    return null
  }

  const user = await getUserFromHeader()
  if (!user) {
    return { user: null }
  }
  return {
    user: new ContextUser(user.id, user.first_name, user.last_name, user.roles),
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

export class ContextUser {
  constructor(
    readonly id: number,
    readonly first_name: string,
    readonly last_name: string,
    readonly roles: UserRole[],
  ) {}

  get full_name() {
    return `${this.first_name} ${this.last_name}`
  }
}

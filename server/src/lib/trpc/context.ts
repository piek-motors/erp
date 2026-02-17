import { TRPCError } from '@trpc/server'
import type * as trpcNext from '@trpc/server/adapters/next'
import { tokenService } from '#root/ioc/index.js'
import { UserRole } from 'models'

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return tokenService.verifyAccess(token)
    }

    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const user = await getUserFromHeader()
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

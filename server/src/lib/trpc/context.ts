import { TRPCError } from '@trpc/server'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { UserRole } from 'models'
import { tokenService } from '#root/ioc/index.js'

export async function createContext({
  request,
  reply,
}: {
  request: FastifyRequest
  reply: FastifyReply
}) {
  async function getUserFromHeader() {
    if (request.headers.authorization) {
      const token = request.headers.authorization.split(' ')[1]
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

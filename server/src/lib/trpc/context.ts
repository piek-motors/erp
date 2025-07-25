import { tokenService } from '#root/ioc/index.js'
import { TRPCError } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

export async function createContext({
  req,
  res
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
    user
  }
}
export type Context = Awaited<ReturnType<typeof createContext>>

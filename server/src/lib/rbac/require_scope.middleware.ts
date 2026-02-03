import { TRPCError } from '@trpc/server'
import { rbac } from '#root/config/rbac_definition.js'
import { logger } from '#root/ioc/log.js'
import type { Scope } from '../constants.js'
import { t } from '../trpc/trpc.js'
import { hasPermission } from './has_permission.js'

export const requireScope = (permission: Scope | string) =>
  t.middleware(({ ctx, next }) => {
    const { roles, first_name, last_name, id } = ctx.user
    const rolePermissions = roles.flatMap(role => rbac[role] || [])
    if (
      !rolePermissions.length ||
      !hasPermission(permission, rolePermissions)
    ) {
      logger.warn(
        `User ${id} ${first_name} ${last_name} does not have permission ${permission}, roles: ${roles}`,
      )
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Недостаточно прав доступа',
      })
    }

    return next()
  })

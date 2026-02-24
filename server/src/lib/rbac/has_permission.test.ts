import { strictEqual } from 'node:assert'
import { describe, test } from 'node:test'
import { hasPermission } from './has_permission.js'

describe('hasPermission', () => {
  test('should verify hasPermission function works with wildcards', () => {
    const perms = ['orders:*']
    // Test order_manager permissions
    strictEqual(hasPermission('orders:create:order', perms), true)
    strictEqual(hasPermission('orders:read', perms), true)
    strictEqual(hasPermission('orders:update', perms), true)
    strictEqual(hasPermission('hr:create', perms), false)
  })

  test('should verify complex wildcard patterns work', () => {
    const testPermissions = ['orders:*:create', 'orders:*:read']

    strictEqual(hasPermission('orders:inventory:create', testPermissions), true)
    strictEqual(hasPermission('orders:sales:create', testPermissions), true)
    strictEqual(hasPermission('orders:inventory:read', testPermissions), true)
    strictEqual(hasPermission('orders:sales:read', testPermissions), true)
    strictEqual(
      hasPermission('orders:inventory:update', testPermissions),
      false,
    )
  })

  test('should verify global wildcard pattern works', () => {
    const testPermissions = ['*']

    strictEqual(hasPermission('any:permission:at:all', testPermissions), true)
    strictEqual(hasPermission('orders:create', testPermissions), true)
    strictEqual(hasPermission('users:update', testPermissions), true)
  })

  test('should verify mixed exact and wildcard permissions work', () => {
    const testPermissions = ['orders:create', 'users:*']

    strictEqual(hasPermission('orders:create', testPermissions), true)
    strictEqual(hasPermission('orders:read', testPermissions), false)
    strictEqual(hasPermission('users:create', testPermissions), true)
    strictEqual(hasPermission('users:update', testPermissions), true)
    strictEqual(hasPermission('products:create', testPermissions), false)
  })
})

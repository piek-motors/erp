/**
 * Checks if a user has the required permission, supporting wildcard patterns
 * @param requiredPermission The specific permission being checked (e.g., 'orders:create:order')
 * @param userPermissions Array of permissions assigned to the role, may contain wildcards
 * @returns true if the user has the required permission, false otherwise
 */
export const hasPermission = (
  requiredPermission: string,
  userPermissions: readonly string[]
): boolean => {
  // If role has the exact permission, grant access
  if (userPermissions.includes(requiredPermission)) {
    return true
  }

  // Check for wildcard permissions
  for (const permission of userPermissions) {
    if (permission.includes('*')) {
      const pattern = permission.replace('*', '.*')
      const regex = new RegExp(`^${pattern}$`)
      if (regex.test(requiredPermission)) {
        return true
      }
    }
  }

  return false
}

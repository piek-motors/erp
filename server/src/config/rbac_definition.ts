import { UserRole } from 'models'

export const rbac: Record<UserRole, string[]> = {
  [UserRole.Admin]: ['*'],
  [UserRole.OrderManager]: ['orders:*'],
  [UserRole.StaffManager]: ['attendance:*'],
  [UserRole.PdoManager]: ['pdo:*']
}

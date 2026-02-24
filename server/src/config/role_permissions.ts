import { UserRole } from 'models'

export const RolePermissionsConfig: Record<UserRole, string[]> = {
  [UserRole.Admin]: ['*'],
  [UserRole.OrderManager]: ['orders:*'],
  [UserRole.StaffManager]: ['hr:*'],
  [UserRole.PdoManager]: ['pdo:*'],
  [UserRole.TimeformerSynchronizer]: ['sync_timeformers:upload'],
}

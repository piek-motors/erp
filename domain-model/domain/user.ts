export enum UserRole {
  Admin = 'admin',
  OrderManager = 'order_manager',
  Bookkeeper = 'bookkeeper',
  MetalflowWorker = 'metalflow_worker',
  WarehouseBookkeeper = 'warehouse_bookkeeper'
}

export class User {
  id!: number
  firstName!: string
  lastName?: string | null
  email!: string
  role!: UserRole
  constructor(dto: Partial<User>) {
    Object.assign(this, dto)
  }
  get fullName() {
    return `${this.firstName} ${this.lastName ?? ''}`.trim()
  }
  get shortName() {
    return `${this.firstName} ${this.lastName?.slice(0, 1)}`.trim()
  }
}

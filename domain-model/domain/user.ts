export enum UserRole {
  Admin = 'admin',
  OrderManager = 'order_manager',
  Bookkeeper = 'bookkeeper',
  MetalflowWorker = 'metalflow_worker',
  WarehouseBookkeeper = 'warehouse_bookkeeper'
}

export class User {
  constructor(
    readonly id: number,
    readonly role: UserRole | null,
    readonly firstName: string,
    readonly lastName: string | null,
    readonly email: string | null
  ) {}

  get fullName() {
    return `${this.firstName} ${this.lastName ?? ''}`.trim()
  }
  get shortName() {
    return `${this.firstName} ${this.lastName?.slice(0, 1)}`.trim()
  }
}

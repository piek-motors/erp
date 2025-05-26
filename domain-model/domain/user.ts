export enum UserRole {
  Admin = 1,
  Manager = 2,
  ProductionManager = 2,
  Bookkeeper = 3
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
